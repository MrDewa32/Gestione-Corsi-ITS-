from flask import Blueprint, request, jsonify
from app.models import Studente, EsameEmbedded, ModuloSnapshot

studenti_bp = Blueprint("studenti", __name__)


@studenti_bp.route("/", methods=["GET"])
def get_studenti():
    studenti = Studente.objects()
    result = []
    for s in studenti:
        data = s.to_mongo().to_dict()
        data["_id"] = str(data["_id"])
        result.append(data)
    return jsonify(result)


# Crea uno studente, gestendo anche esami embedded e modulo snapshot
@studenti_bp.route("/", methods=["POST"])
def create_studente():
    data = request.json
    esami_data = data.pop("esami", [])
    esami = []
    for esame in esami_data:
        modulo_data = esame.get("modulo")
        if modulo_data:
            modulo = ModuloSnapshot(**modulo_data)
            esame["modulo"] = modulo
        esami.append(EsameEmbedded(**esame))
    studente = Studente(**data, esami=esami)
    studente.save()
    result = studente.to_mongo().to_dict()
    result["_id"] = str(result["_id"])
    return jsonify(result), 201


@studenti_bp.route("/<string:studente_id>", methods=["GET"])
def get_studente(studente_id):
    studente = Studente.objects(id=studente_id).first()
    if not studente:
        return jsonify({"error": "Studente non trovato"}), 404
    result = studente.to_mongo().to_dict()
    result["_id"] = str(result["_id"])
    return jsonify(result)


# Aggiorna uno studente, gestendo anche esami embedded e modulo snapshot
@studenti_bp.route("/<string:studente_id>", methods=["PUT"])
def update_studente(studente_id):
    data = request.json
    studente = Studente.objects(id=studente_id).first()
    if not studente:
        return jsonify({"error": "Studente non trovato"}), 404
    esami_data = data.pop("esami", None)
    if esami_data is not None:
        esami = []
        for esame in esami_data:
            modulo_data = esame.get("modulo")
            if modulo_data:
                modulo = ModuloSnapshot(**modulo_data)
                esame["modulo"] = modulo
            esami.append(EsameEmbedded(**esame))
        data["esami"] = esami
    studente.update(**data)
    studente.reload()
    result = studente.to_mongo().to_dict()
    result["_id"] = str(result["_id"])
    return jsonify(result)


@studenti_bp.route("/<string:studente_id>", methods=["DELETE"])
def delete_studente(studente_id):
    studente = Studente.objects(id=studente_id).first()
    if not studente:
        return jsonify({"error": "Studente non trovato"}), 404
    studente.delete()
    return "", 204
