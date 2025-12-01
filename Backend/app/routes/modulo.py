from flask import Blueprint, request, jsonify
from app.models import Modulo, StudenteSubset

modulo_bp = Blueprint("modulo", __name__)

@modulo_bp.route("/", methods=["GET"])
def get_moduli():
    moduli = Modulo.objects()
    result = []
    for m in moduli:
        data = m.to_mongo().to_dict()
        data["_id"] = str(data["_id"])
        # Convertire gli ObjectId in stringhe per gli studenti iscritti
        for studente in data.get("studentiIscritti", []):
            if "studente_id" in studente and studente["studente_id"] is not None:
                studente["studente_id"] = str(studente["studente_id"])
        result.append(data)
    return jsonify(result)

@modulo_bp.route("/", methods=["POST"])
def create_modulo():
    data = request.json
    studenti_data = data.pop("studentiIscritti", [])
    studenti = []
    for studente in studenti_data:
        studenti.append(StudenteSubset(**studente))
    modulo = Modulo(**data, studentiIscritti=studenti)
    modulo.save()
    result = modulo.to_mongo().to_dict()
    result["_id"] = str(result["_id"])
    # Convertire gli ObjectId in stringhe per gli studenti iscritti
    for studente in result.get("studentiIscritti", []):
        if "studente_id" in studente and studente["studente_id"] is not None:
            studente["studente_id"] = str(studente["studente_id"])
    return jsonify(result), 201

@modulo_bp.route("/<string:modulo_id>", methods=["GET"])
def get_modulo(modulo_id):
    modulo = Modulo.objects(id=modulo_id).first()
    if not modulo:
        return jsonify({"error": "Modulo non trovato"}), 404
    result = modulo.to_mongo().to_dict()
    result["_id"] = str(result["_id"])
    # Convertire gli ObjectId in stringhe per gli studenti iscritti
    for studente in result.get("studentiIscritti", []):
        if "studente_id" in studente and studente["studente_id"] is not None:
            studente["studente_id"] = str(studente["studente_id"])
    return jsonify(result)

@modulo_bp.route("/<string:modulo_id>", methods=["PUT"])
def update_modulo(modulo_id):
    data = request.json
    modulo = Modulo.objects(id=modulo_id).first()
    if not modulo:
        return jsonify({"error": "Modulo non trovato"}), 404
    studenti_data = data.pop("studentiIscritti", None)
    if studenti_data is not None:
        studenti = []
        for studente in studenti_data:
            studenti.append(StudenteSubset(**studente))
        modulo.studentiIscritti = studenti
    for key, value in data.items():
        setattr(modulo, key, value)
    modulo.save()
    result = modulo.to_mongo().to_dict()
    result["_id"] = str(result["_id"])
    # Convertire gli ObjectId in stringhe per gli studenti iscritti
    for studente in result.get("studentiIscritti", []):
        if "studente_id" in studente and studente["studente_id"] is not None:
            studente["studente_id"] = str(studente["studente_id"])
    return jsonify(result)

@modulo_bp.route("/<string:modulo_id>", methods=["DELETE"])
def delete_modulo(modulo_id):
    modulo = Modulo.objects(id=modulo_id).first()
    if not modulo:
        return jsonify({"error": "Modulo non trovato"}), 404
    modulo.delete()
    return jsonify({"message": "Modulo eliminato con successo"})
    

