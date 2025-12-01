from flask import Blueprint, request, jsonify, current_app
from app import db
from bson import ObjectId

modulo_bp = Blueprint("modulo", __name__)

@modulo_bp.get("/")
def get_moduli():
    moduli = db.modulo.find()
    return jsonify(moduli=[{**m, "_id": str(m["_id"])} for m in moduli])

@modulo_bp.get("/<string:codice>")
def get_modulo(codice):
    modulo = db.modulo.find_one({"_id": ObjectId(codice)})
    return jsonify(modulo ={**modulo, "_id": str(modulo["_id"])})

@modulo_bp.post("/")
def create_modulo():
    data = request.json
    
    # Inserisci nel database
    result = db.modulo.insert_one(data)
    data["_id"] = str(result.inserted_id)
    
    return jsonify(data), 201


@modulo_bp.put("/<string:_id>")
def update_modulo(_id):
    data = request.json
    
    result = db.modulo.update_one({"_id": ObjectId(_id)}, {"$set": data})
    
    if result.matched_count == 0:
        return jsonify({"error": "Modulo non trovato"}), 404
    
    # Recupera il documento aggiornato
    modulo = db.modulo.find_one({"_id": ObjectId(_id)})
    return jsonify(modulo={**modulo, "_id": str(modulo["_id"])})


@modulo_bp.delete("/<string:_id>")
def delete_modulo(_id):
    
    result = db.modulo.delete_one({"_id": ObjectId(_id)})

    if result.deleted_count == 0:
        return jsonify({"error": "Modulo non trovato"}), 404
       

    return jsonify({"message": "Modulo eliminato con successo"})