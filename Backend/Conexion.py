import os
from dotenv import load_dotenv
from neo4j import GraphDatabase
from flask import Flask, request, jsonify

load_dotenv()

uri = os.getenv("NEO4J_URI")
user = "neo4j"
password = os.getenv("NEO4J_CONTRASENA")
consulta = "MATCH (p:Usuario {nombre: 'Jacky'}) RETURN p"
driver = GraphDatabase.driver(uri, auth=(user, password))

def testConnection():
    try:
        with driver.session() as session:
            result = session.run(consulta).single()
            a = result["p"].items()
            b = dict(a)
            print(a)
        print(b)
    except Exception as e:
        print("Error al conectar con Neo4j:", e)
    finally:
        driver.close()


testConnection()