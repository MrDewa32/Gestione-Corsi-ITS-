from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId

studenti_bp = Blueprint("studenti", __name__)


@studenti_bp.route("/", methods=["GET"])
def get_studenti():
    """Lista tutti gli studenti"""
    db = current_app.config["MONGO_DB"]
    studenti = list(db.studente.find())
    for s in studenti:
        s["_id"] = str(s["_id"])
    return jsonify(studenti)


@studenti_bp.route("/", methods=["POST"])
def create_studente():
    """Crea nuovo studente con embedded documents"""
    db = current_app.config["MONGO_DB"]
    data = request.json

    if not data.get("nome") or not data.get("email"):
        return jsonify({"error": "Nome ed email sono obbligatori"}), 400

    # PyMongo gestisce automaticamente gli embedded documents come dict annidati, non devo fare nulla di strano come in MongoEngine....😒
    result = db.studente.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return jsonify(data), 201


@studenti_bp.route("/<string:studente_id>", methods=["GET"])
def get_studente(studente_id):
    """Dettaglio studente specifico"""
    db = current_app.config["MONGO_DB"]

    try:
        studente = db.studente.find_one({"_id": ObjectId(studente_id)})
    except:
        return jsonify({"error": "ID non valido"}), 400

    if not studente:
        return jsonify({"error": "Studente non trovato"}), 404

    studente["_id"] = str(studente["_id"])
    return jsonify(studente)


@studenti_bp.route("/<string:studente_id>", methods=["PUT"])
def update_studente(studente_id):
    """Aggiorna studente esistente"""
    db = current_app.config["MONGO_DB"]
    data = request.json

    try:
        result = db.studente.update_one({"_id": ObjectId(studente_id)}, {"$set": data})
    except:
        return jsonify({"error": "ID non valido"}), 400

    if result.matched_count == 0:
        return jsonify({"error": "Studente non trovato"}), 404

    # Recupera documento aggiornato
    studente = db.studente.find_one({"_id": ObjectId(studente_id)})
    studente["_id"] = str(studente["_id"])
    return jsonify(studente)


@studenti_bp.route("/<string:studente_id>", methods=["DELETE"])
def delete_studente(studente_id):
    """Elimina studente"""
    db = current_app.config["MONGO_DB"]

    try:
        result = db.studente.delete_one({"_id": ObjectId(studente_id)})
    except:
        return jsonify({"error": "ID non valido"}), 400

    if result.deleted_count == 0:
        return jsonify({"error": "Studente non trovato"}), 404

    return "", 204
