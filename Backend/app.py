import os
import bcrypt
import atexit
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from neo4j import GraphDatabase
from neo4j.exceptions import Neo4jError

load_dotenv()
# Cargar variables de entorno de para su uso en el driver
uri = os.getenv('NEO4J_URI')
user = 'neo4j'
password = os.getenv('NEO4J_PASSWORD')
# Cargar el driver
driver = GraphDatabase.driver(uri, auth=(user, password) )
app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://127.0.0.1:5173"])

@app.route('/', methods=['GET'])
def index():
    return '-Inicio-'

@app.route('/users', methods=['GET']) #Obtener a todos los usuarios
def getUsers():
    try:
        with driver.session() as session:
            result = session.run('MATCH (p:Usuario) RETURN p')
            users = []
            for record in result: #Recorrer los registros
                users.append(dict(record['p'].items())) #Convertir a un diccionario
            return jsonify(users) #Retornar los usuarios
        
    except Neo4jError as e:
        print('Error obtener usuarios: ', e)
        return jsonify({"message": e})

@app.route("/universidades", methods=["GET"]) #Obtener a todos los universidades
def getUniversidades():
    try:
        with driver.session() as session:
            result = session.run("MATCH (p:Universidad) RETURN p") #Consultar la base de datos
            universidades = []
            for record in result: #Recorrer los registros
                universidades.append(dict(record["p"].items())) #Convertir a un diccionario
            return jsonify(universidades)
        
    except Neo4jError as e:
        print("Error obtener universidades: ", e)
        return jsonify({"message": e})

@app.route("/carreras", methods=["GET"]) #Obtener a todos las carreras
def getCarreras():
    try:
        with driver.session() as session:
            result = session.run("MATCH (p:Carrera) RETURN p")
            carreras = []
            for record in result:
                carreras.append(dict(record["p"].items())) #Convertir a un diccionario
            return jsonify(carreras) #Retornar las carreras
    except Neo4jError as e:
        print("Error obtener carreras: ", e) 
        return jsonify({"message" : e})
    
# Obtener detalles de las carreras.
@app.route("/carrera", methods=['GET'])
def getCarrera():
    nombre_carrera = request.args.get("nombre") #Obtener el nombre de la carrera
    if not nombre_carrera: #Si no se proporciona el nombre de la carrera retornar mensaje de error
        return jsonify({"message": "Falta el parámetro 'nombre"}), 400
    
    try:
        with driver.session() as session:
            consulta = """ 
            MATCH (c:Carrera {nombre: $nombre})-[r:IMPARTIDA_EN]-(u:Universidad)
            WITH c, COLLECT(r.pensum) AS pensum, COLLECT(u.nombre) As universidades,
            COLLECT(r.nombreEspecifico) AS nombresEsp, COLLECT(r.duracion) AS duraciones
            RETURN c.nombre AS Carrera, c.descripcion AS Descripción, pensum AS Pensum, nombresEsp AS NombresEspecificos, duraciones AS Duraciones, universidades AS Universidades
            """ #Consulta para obtener los detalles de la carrera
            result = session.run(consulta, nombre=nombre_carrera).single() #Consultar la base de datos
            respuesta = { #Crear un diccionario con los datos
                "Carrera": result["Carrera"],
                "Descripción": result["Descripción"],
                "Pensum": result["Pensum"],
                "NombresEspecificos": result["NombresEspecificos"],
                "Duraciones": result["Duraciones"],
                "Universidades": result["Universidades"]
            }
            return jsonify(respuesta), 200
        
    except Neo4jError as e:
        print("Error al obtener información de la carrera: ", e)
        return jsonify({"message": str(e)}), 500
    
# Obtener becas
@app.route("/becas", methods=['GET'])
def getBecas():
    try:
        with driver.session() as session:
            consulta = """
            MATCH (b:Becas)
            RETURN b.nombre AS Nombre, b.descripcion AS Descripcion, b.masInformacion AS MasInformacion
            """ #Consulta para obtener las becas
            result = session.run(consulta)
            becas_info = [] #Crear una lista para almacenar la información de las becas
            for record in result:
                becas_info.append(dict(record))
            return jsonify(becas_info)
        
    except Neo4jError as e:
        print("Error al obtener información de las becas: ", e)
        return jsonify({"message": str(e)}), 500

@app.route('/recomendation', methods=['GET']) #Ruta para obtener recomendaciones
def recomendation():
    correoIN = request.args.get('correo') #Obtener el correo del usuario
    if not correoIN:
        return jsonify({"message": "Falta el parámetro 'correo'"}), 400 #Si no se proporciona el correo retornar mensaje de error
                
    try:
        with driver.session() as session:
            result = session.run( #Obtiene un porcentaje de afinidad en base a la puntuación máxima que puede tener una carrera y el peso de las relaciones de usuario a carrera
                    """
                        MATCH (u:Usuario {correo: $correo})-[r1]-(carac:Academicos|Personalidad|Hobbie)-[r2:CARACTERISTICA_DE]->(car:Carrera)
                        WITH car, sum(r1.peso + r2.peso) AS pesototal
                        MATCH (carac2:Academicos|Personalidad|Hobbie)-[r3:CARACTERISTICA_DE]->(car)
                        WITH car, pesototal,
                            count(r3) AS cantRelacionesCaC,
                            sum(r3.peso) AS sumaPesosCaC

                        WITH car, pesototal, cantRelacionesCaC, sumaPesosCaC,
                            (cantRelacionesCaC * 10 + sumaPesosCaC) AS pesoMax,
                            100*(toFloat(pesototal) / (cantRelacionesCaC * 10 + sumaPesosCaC)) AS promedio

                        RETURN car.nombre AS Carrera,
                            promedio AS Promedio
                        ORDER BY promedio DESC LIMIT 5
                    """, {'correo': correoIN}
            ) #Consulta para obtener recomendaciones
            recomendaciones = []
            for record in result: #Almacenar la información de las recomendaciones
                recomendaciones.append(
                    {
                        "carrera": record['Carrera'], #Nombre de la carrera
                        "promedio": record['Promedio'] #Promedio de afinidad
                    }
                )
            return jsonify(recomendaciones), 200
    except Neo4jError as e:
        print("Error al obtener recomendaciones: ", e)
        return jsonify({'message': 'Error al obtener recomendaciones', "message": e}), 400

@app.route('/login', methods=['POST']) #Ruta para iniciar sesión
def login():
    data = request.get_json() #Obtener los datos del usuario
    contrasena = data.get('contrasena') #Obtener la contraseña del usuario
    correo = data.get('correo') #Obtener el correo del usuario
    try:
        with driver.session() as session:
            consulta = """
            MATCH (p:Usuario {correo: $correo})
            RETURN p.correo AS correo, p.contrasena AS contrasena, p.nombre AS nombre
            """ #Consulta para obtener el usuario
            result = session.run(consulta, correo=correo).single() #Ejecutar la consulta
            if not result: 
                return jsonify({'error': 'Usuario no encontrado'}), 404 #Si no se encuentra el usuario retornar mensaje de error
            contrasena_guardada = result['contrasena'] #Obtener la contraseña guardada del usuario
            if bcrypt.checkpw(contrasena.encode('utf-8'), contrasena_guardada.encode('utf-8')): #Verificar la contraseña
                return jsonify({
                    'message': 'Inicio de sesión exitoso',
                    'usuario': {
                        'correo': result['correo'],
                        'nombre': result['nombre']
                    }
                    }), 200 #Si la contraseña es correcta retornar mensaje de inicio de sesión exitoso
            else:
                return jsonify({'respuesta': 'Contraseña incorrecta'}), 200 #Si la contraseña es incorrecta retornar mensaje de error
    except Neo4jError as e:
        print('Error al hacer login:', e)
        return jsonify({"message": e})

#Registro de usuarios
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json() #Obtener los datos del usuario
    correo = data.get('correo')
    nombre = data.get('nombre')
    contrasena = data.get('contrasena')
    try:
        with driver.session() as session:
            result = session.run("MATCH (u:Usuario {correo: $correo}) RETURN u", correo=correo).single() #Consulta para verificar si el correo ya existe
            if result:
                return jsonify({'message': 'Correo ya registrado'}), 400 #Si el correo ya existe retornar mensaje de error
            else:
                hashed_password = bcrypt.hashpw(contrasena.encode('utf-8'), bcrypt.gensalt()).decode('utf-8') #Hash de la contraseña
                session.run("CREATE (u:Usuario {correo: $correo, contrasena: $contra, nombre: $nom})", correo=correo, contra=hashed_password, nom=nombre) #Crear un nuevo usuario
                return jsonify({'message': 'Usuario creado exitosamente'}), 200
    except Neo4jError as e:
        return jsonify({"message": 'Error agregndo al usuario' + e}), 400

#Cambio de contraseña
@app.route('/changePassword', methods=['PUT'])
def changePassword():
    #Obtener los datos del usuario
    data = request.get_json()
    user = data.get('user')
    past_password = data.get('past_password')
    new_password = data.get('new_password')
    # Verificar la contraseña actual
    try:
        hasedPass = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8') #Hash de la contraseña
        with driver.session() as session:
            result = session.run(
                """
                MATCH (u:Usuario {correo: $correo})
                RETURN u.contrasena AS contrasena
                """,
                correo=user,
            ).single() # Consulta para verificar si el correo ya existe
            if result:
                if bcrypt.checkpw(past_password.encode('utf-8'), result['contrasena'].encode('utf-8')):
                    session.run(
                        """
                        MATCH (u:Usuario {correo: $correo})
                        SET u.contrasena = $contrasena
                        RETURN u.contrasena AS contrasena
                        """,
                        correo=user,
                        contrasena=hasedPass
                    ) # Actualizar la contraseña
                    return jsonify({'message': 'Contraseña actualizada correctamente'})
                else:
                    return jsonify({'message': 'La contraseña antigua no es correcta'})
            else:
                return jsonify({'message': 'El usuario no existe'})
    except Exception as e:
        return jsonify({'message': 'Error al cambiar la contraseña'})

@app.route('/fillform', methods=['POST']) #Ruta para llenar el formulario
def fillform():
    data = request.get_json()
    correoIN = request.args.get('correo') #Obtener el correo del usuario
    for q in data: #Recorrer los datos del formulario
        grupoIN = q.get('grupo')
        rasgoIN = q.get('rasgo')
        pesoIN = q.get('peso')
        relacion = 'ES_ALGUIEN' if grupoIN.lower() == 'personalidad' else 'ES_BUENO_EN' if grupoIN.lower() == 'academicos' else 'LE_GUSTA'
        if not correoIN:
            return jsonify({'message': 'Falta el correo'}), 400 #Si no fue enviado un correo , devolver un error
        query = f"""
                    MATCH (u:Usuario {{correo: $correo}})
                    MATCH (g:{grupoIN} {{name: $rasgo}})
                    MERGE (u)-[:{relacion} {{peso: $peso}}]->(g)
                    RETURN 'relacion creada' as message
                    """ #Consulta para crear la relacion
        try:
            with driver.session() as session:
                if pesoIN != 0: #Si el peso no es 0 crear relaciones
                    result = session.run(
                        query,
                        correo = correoIN,
                        rasgo = rasgoIN,
                        peso = pesoIN,
                    ).single()
                    print(result['message']) #Imprimir el mensaje de la consulta
        except Exception as e:
            return jsonify({'message': 'Error al crear la relacion'}), 400 #Si hay un error devolver un error
    return jsonify({'message': 'Relaciones creadas correctamente'}), 200 

if __name__ == '__main__': #Si se ejecuta el archivo directamente
    app.run(debug=True, port=8080) #Ejecutar el servidor con debug activado y en el puerto 8080

@atexit.register #Funcion para cerrar la sesion de neo4j
def closeDriver():
    driver.close()
