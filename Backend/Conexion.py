from neo4j import GraphDatabase

uri = "neo4j+s://2a0c3cba.databases.neo4j.io"
user = "neo4j"
password = "dUAr9GZgg2OECgJCvW-xSUMx8ojbZLXzxDpbjDNjVgg"
consulta = "MATCH (p:Usuario {nombre: 'Jacky'}) RETURN p.nombre AS nombre, p.correo AS correo"
driver = GraphDatabase.driver(uri, auth=(user, password))

def testConnection():
    try:
        with driver.session() as session:
            result = session.run(consulta)
            for record in result:
                print(f"Usuario: {record['nombre']} // Correo: {record['correo']}")
        print("Conexión exitosa a Neo4j Aura.")
    except Exception as e:
        print("Error al conectar con Neo4j:", e)
    finally:
        driver.close()

testConnection()