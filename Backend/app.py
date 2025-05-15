import os
import bcrypt
import atexit
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from neo4j import GraphDatabase

load_dotenv()
# Cargar variables de entorno de para su uso en el driver
uri = os.getenv('NEO4J_URI')
user = 'neo4j'
password = os.getenv('NEO4J_PASSWORD')
# Cargar el driver
driver = GraphDatabase.driver(uri, auth=(user, password))
app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return '-Inicio-'

@app.route('/users', methods=['GET'])
def getUsers():
    try:
        with driver.session() as session:
            result = session.run('MATCH (p:Usuario) RETURN p')
            users = []
            for record in result:
                users.append(dict(record['p'].items()))
            return jsonify(users)
        
    except Exception as e:
        print('Error obtener usuarios: ', e)


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    contrasena = data.get('contrasena')
    correo = data.get('correo')
    try:
        with driver.session() as session:
            consulta = """
            MATCH (p:Usuario {correo: $correo})
            RETURN p.correo AS correo, p.contrasena AS contrasena, p.nombre AS nombre
            """
            result = session.run(consulta, correo=correo).single()
            if not result:
                return jsonify({'error': 'Usuario no encontrado'}), 404
            contrasena_guardada = result['contrasena']
            if bcrypt.checkpw(contrasena.encode('utf-8'), contrasena_guardada.encode('utf-8')):
                return jsonify({
                    'message': 'Inicio de sesión exitoso',
                    'usuario': {
                        'correo': result['correo'],
                        'nombre': result['nombre']
                    }
                    }), 200
            else:
                return jsonify({'respuesta': 'Contraseña incorrecta'}), 200
    except Exception as e:
        print('Error al hacer login:', e)

#Cambio de contraseña
@app.route('/changePassword', methods=['PUT'])
def changePassword():
    # Get the new password from the request body
    data = request.get_json()
    user = data.get('user')
    past_password = data.get('past_password')
    new_password = data.get('new_password')
    # Hash the new password using bcrypt
    try:
        hasedPass = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        with driver.session() as session:
            result = session.run(
                """
                MATCH (u:Usuario {correo: $correo})
                RETURN u.contrasena AS contrasena
                """,
                correo=user,
            ).single()
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
                    )
                    return jsonify({'message': 'Contraseña actualizada correctamente'})
                else:
                    return jsonify({'message': 'La contraseña antigua no es correcta'})
            else:
                return jsonify({'message': 'El usuario no existe'})
    except Exception as e:
        return jsonify({'error': 'Error al cambiar la contraseña'})

@app.route('/fillform', methods=['POST'])
def fillform():
    data = request.get_json()
    correoIN = request.args.get('correo')
    for q in data:
        grupoIN = q.get('grupo')
        rasgoIN = q.get('rasgo')
        pesoIN = q.get('peso')
        relacion = 'ES_ALGUIEN' if grupoIN.lower() == 'personalidad' else 'ES_BUENO_EN' if grupoIN.lower() == 'academicos' else 'LE_GUSTA'
        if not correoIN:
            return jsonify({'error': 'Falta el correo'}), 400
        query = f"""
                    MATCH (u:Usuario {{correo: $correo}})
                    MATCH (g:{grupoIN} {{name: $rasgo}})
                    MERGE (u)-[:{relacion} {{peso: $peso}}]->(g)
                    RETURN 'relacion creada' as message
                    """
        try:
            with driver.session() as session:
                if pesoIN != 0:
                    result = session.run(
                        query,
                        correo = correoIN,
                        rasgo = rasgoIN,
                        peso = pesoIN,
                    ).single()
                    print(result['message'])
        except Exception as e:
            return jsonify({'error': 'Error al crear la relacion'}), 400
    return jsonify({'message': 'Relaciones creadas correctamente'}), 200

if __name__ == '__main__':
    app.run(debug=True)

@atexit.register
def closeDriver():
    driver.close()