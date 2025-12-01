from flask import Flask
from mongoengine import connect
from .config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    connect(
        db=app.config["MONGODB_SETTINGS"]["db"],
        host=app.config["MONGODB_SETTINGS"]["host"],
        port=app.config["MONGODB_SETTINGS"]["port"],
    )
    from app.routes import studenti_bp

    app.register_blueprint(studenti_bp, url_prefix="/studenti")

    from app.routes.modulo import modulo_bp
    app.register_blueprint(modulo_bp, url_prefix="/moduli")

    return app
