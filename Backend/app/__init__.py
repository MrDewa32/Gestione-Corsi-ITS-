from flask import Flask
from pymongo import MongoClient
from .config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Connessione PyMongo per l'applicazione Flask
    client = MongoClient(
        host=app.config["MONGODB_SETTINGS"]["host"],
        port=app.config["MONGODB_SETTINGS"]["port"],
    )
    app.config["MONGO_CLIENT"] = client
    app.config["MONGO_DB"] = client[app.config["MONGODB_SETTINGS"]["db"]]
    from app.routes import studenti_bp

    app.register_blueprint(studenti_bp, url_prefix="/studenti")

    from app.routes.modulo import modulo_bp

    app.register_blueprint(modulo_bp, url_prefix="/moduli")

    return app
