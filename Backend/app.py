from flask import Flask
import pymongo

client = pymongo.MongoClient("localhost", 27017)
db = client["Gestione-Corsi-ITS"]

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/test-mongo")
def test_mongo():
    return client.list_database_names()
