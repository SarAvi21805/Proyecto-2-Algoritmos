import os
import bcrypt
import atexit
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from neo4j import GraphDatabase

load_dotenv()
# Cargar variables de entorno de para su uso en el driver
uri = os.getenv("NEO4J_URI")
user = "neo4j"
password = os.getenv("NEO4J_PASSWORD")
# Cargar el driver
driver = GraphDatabase.driver(uri, auth=(user, password))
app = Flask(__name__)

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
                    return jsonify({"message": "Contrasña actualizada correctamente"})
                else:
                    return jsonify({"message": "La contraseña antigua no es correcta"})
            else:
                return jsonify({"message": "El usuario no existe"})
    except Exception as e:
        return jsonify({"error": "Error al cambiar la contraseña"})


@app.route('/', methods=["GET"])
def index():
    return "-Inicio-"

@app.route('/users', methods=["GET"])
def getUsers():
    try:
        with driver.session() as session:
            result = session.run("MATCH (p:Usuario) RETURN p")
            users = []
            for record in result:
                users.append(dict(record['p'].items()))
            return jsonify(users)
        
    except Exception as e:
        print("Error obtener usuarios: ", e)


@app.route('/login', methods=["POST"])
def login():
    data = request.get_json()
    contrasena = data.get("contrasena")
    correo = data.get("correo")
    try:
        with driver.session() as session:
            consulta = """
            MATCH (p:Usuario {correo: $correo})
            RETURN p.correo AS correo, p.contrasena AS contrasena, p.nombre AS nombre
            """
            result = session.run(consulta, correo=correo).single()
            if not result:
                return jsonify({"error": "Usuario no encontrado"}), 404
            contrasena_guardada = result["contrasena"]
            if bcrypt.checkpw(contrasena.encode('utf-8'), contrasena_guardada.encode('utf-8')):
                return jsonify({
                    "message": "Inicio de sesión exitoso",
                    "usuario": {
                        "correo": result["correo"],
                        "nombre": result["nombre"]
                    }
                    }), 200
            else:
                return jsonify({"respuesta": "Contraseña incorrecta"}), 200
    except Exception as e:
        print("Error al hacer login:", e)


if __name__ == '__main__':
    app.run(debug=True)

@atexit.register
def closeDriver():
    driver.close()