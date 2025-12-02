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

@studenti_bp.route("/media", methods=["GET"])
def media_studenti():
    """Calcola la media dei voti di ogni studente"""
    db = current_app.config["MONGO_DB"]
    studenti = list(db.studente.find())
    risultato = []

    for s in studenti:
        esami = s.get("esami", [])
        voti = [e.get("voto") for e in esami if "voto" in e]
        media = round(sum(voti) / len(voti), 2) if voti else None

        risultato.append({
            "cognome": s.get("cognome"),
            "nome": s.get("nome"),
            "voti": media
        })

    return jsonify(risultato), 200


@studenti_bp.route("/voti-alti", methods=["GET"])
def voti_alti_studenti():
    """Mostra i voti >= 24 di ogni studente"""
    db = current_app.config["MONGO_DB"]
    studenti = list(db.studente.find())
    risultato = []

    for s in studenti:
        esami = s.get("esami", [])
        voti_alti = [e.get("voto") for e in esami if e.get("voto", 0) >= 24]

        risultato.append({
            "nome": s.get("nome"),
            "cognome": s.get("cognome"),
            "voti_alti": voti_alti
        })

    return jsonify(risultato), 200

@studenti_bp.route("/media/<string:studente_id>", methods=["GET"])
def media_studente(studente_id):
    """Media voti di uno studente specifico"""
    db = current_app.config["MONGO_DB"]
    try:
        s = db.studente.find_one({"_id": ObjectId(studente_id)})
    except:
        return jsonify({"error": "ID non valido"}), 400

    if not s:
        return jsonify({"error": "Studente non trovato"}), 404

    esami = s.get("esami", [])
    voti = [e.get("voto") for e in esami if "voto" in e]
    media = round(sum(voti) / len(voti), 2) if voti else None

    risultato = {
        "cognome": s.get("cognome"),
        "nome": s.get("nome"),
        "voti": media
    }

    return jsonify(risultato), 200


@studenti_bp.route("/voti-alti/<string:studente_id>", methods=["GET"])
def voti_alti_studente(studente_id):
    """Voti >=24 di uno studente specifico"""
    db = current_app.config["MONGO_DB"]
    try:
        s = db.studente.find_one({"_id": ObjectId(studente_id)})
    except:
        return jsonify({"error": "ID non valido"}), 400

    if not s:
        return jsonify({"error": "Studente non trovato"}), 404

    esami = s.get("esami", [])
    voti_alti = [e.get("voto") for e in esami if e.get("voto", 0) >= 24]

    risultato = {
        "cognome": s.get("cognome"),
        "nome": s.get("nome"),
        "voti": voti_alti
    }

    return jsonify(risultato), 200
