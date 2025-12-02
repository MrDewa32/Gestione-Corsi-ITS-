# Guida: Conversione da MongoEngine a PyMongo

## Indice
1. [Differenze tra MongoEngine e PyMongo](#differenze)
2. [Strategia di conversione](#strategia)
3. [Configurazione e connessione](#configurazione)
4. [Conversione Routes](#routes)
5. [Embedded Documents](#embedded)
6. [Operatori MongoDB](#operatori)
7. [Riepilogo vantaggi](#riepilogo)

---

## Differenze tra MongoEngine e PyMongo {#differenze}

### MongoEngine (ODM - Object Document Mapper)
**Livello di astrazione alto**

```python
# Definisci classi Python
class Studente(Document):
    nome = StringField(required=True)
    cognome = StringField(required=True)
    email = EmailField(required=True, unique=True)
    esami = ListField(EmbeddedDocumentField(EsameEmbedded))

# Lavori con oggetti
studente = Studente.objects(id="...").first()
studente.nome = "Mario"
studente.save()
```

**Caratteristiche:**
- ✅ Schema validation automatica con campi tipizzati
- ✅ Sintassi simile a ORM (es. Django ORM)
- ✅ Gestione automatica di embedded documents
- ✅ Codice più leggibile per chi conosce OOP
- ❌ Overhead di performance
- ❌ Meno flessibilità nelle query complesse

### PyMongo (Driver nativo MongoDB)
**Livello basso - accesso diretto**

```python
# Lavori direttamente con dizionari
db = client["Gestione-Corsi-ITS"]
studente = db.studenti.find_one({"_id": ObjectId("...")})
studente["nome"] = "Mario"
db.studenti.update_one({"_id": studente["_id"]}, {"$set": studente})
```

**Caratteristiche:**
- ✅ Più veloce (nessun overhead ODM)
- ✅ Controllo totale sulle query MongoDB
- ✅ Nessuna "magia" nascosta
- ✅ Più flessibile per operazioni complesse
- ❌ Più codice boilerplate
- ❌ Validazione manuale (se necessaria)
- ❌ Devi gestire manualmente ObjectId

---

## Strategia di conversione {#strategia}

### Perché mantenere MongoEngine solo in genera_dati.py?

**MongoEngine è comodo per creare dati strutturati complessi** perché:
- Valida automaticamente i tipi (StringField, IntField, etc.)
- Gestisce facilmente gli embedded documents annidati
- Le classi `Studente`, `Modulo`, `EsameEmbedded` sono già funzionanti

**PyMongo nell'applicazione principale** perché:
- È quello richiesto dal progetto
- Più veloce e leggero per le operazioni CRUD
- Maggiore controllo sulle query
- Meno "magia" nascosta

### Struttura del progetto

```
app/
├── models/              # MANTIENI - solo per genera_dati.py
│   ├── __init__.py
│   ├── studente.py     # Classi MongoEngine
│   └── modulo.py       # Classi MongoEngine
├── routes/              # CONVERTI a PyMongo
│   ├── __init__.py
│   ├── studenti.py     # Dict invece di Studente.objects()
│   └── moduli.py       # NUOVO - da creare con PyMongo
└── utils/
    └── genera_dati.py  # USA MongoEngine per caricare dati
```

---

## Configurazione e connessione {#configurazione}

### app/__init__.py - Due connessioni parallele

**PRIMA (solo MongoEngine):**
```python
from flask import Flask
import mongoengine
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Solo MongoEngine
    mongoengine.connect(**Config.MONGODB_SETTINGS)
    
    from app.routes import studenti_bp
    app.register_blueprint(studenti_bp, url_prefix="/studenti")
    
    return app
```

**DOPO (PyMongo per Flask, MongoEngine disponibile per genera_dati):**
```python
from flask import Flask
from pymongo import MongoClient
from app.config import Config

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # CONNESSIONE PYMONGO (per l'app Flask)
    client = MongoClient(
        host=Config.MONGODB_SETTINGS["host"],
        port=Config.MONGODB_SETTINGS["port"]
    )
    app.config["MONGO_CLIENT"] = client
    app.config["MONGO_DB"] = client[Config.MONGODB_SETTINGS["db"]]
    
    # MONGOENGINE rimane disponibile per genera_dati.py
    # Non lo inizializziamo qui, ma genera_dati può usarlo indipendentemente
    
    from app.routes import studenti_bp
    app.register_blueprint(studenti_bp, url_prefix="/studenti")
    
    return app
```

**Cosa cambia:**
- ✅ Flask usa PyMongo per tutte le routes
- ✅ `genera_dati.py` continua a usare MongoEngine indipendentemente
- ✅ Stesso database, due driver diversi (compatibili!)
- ✅ `app.config["MONGO_DB"]` disponibile in tutte le routes

---

## Conversione Routes {#routes}

### 1. GET - Lista tutti gli studenti

**PRIMA (MongoEngine):**
```python
from flask import Blueprint, request, jsonify
from app.models import Studente, EsameEmbedded, ModuloSnapshot

studenti_bp = Blueprint("studenti", __name__)

@studenti_bp.route("/", methods=["GET"])
def get_studenti():
    studenti = Studente.objects()  # ← Oggetti Python
    result = []
    for s in studenti:
        data = s.to_mongo().to_dict()  # ← Conversione necessaria
        data["_id"] = str(data["_id"])
        result.append(data)
    return jsonify(result)
```

**DOPO (PyMongo):**
```python
from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId

studenti_bp = Blueprint("studenti", __name__)

@studenti_bp.route("/", methods=["GET"])
def get_studenti():
    db = current_app.config["MONGO_DB"]
    studenti = list(db.studenti.find())  # ← Già dizionari!
    for s in studenti:
        s["_id"] = str(s["_id"])  # ← Stessa conversione ObjectId
    return jsonify(studenti)
```

**Differenze chiave:**
- `Studente.objects()` → `db.studenti.find()`
- Non serve più `.to_mongo().to_dict()` perché PyMongo restituisce già dict
- Devi importare `ObjectId` manualmente da `bson`
- `current_app.config["MONGO_DB"]` per accedere al database

---

### 2. POST - Creazione studente

**PRIMA (MongoEngine):**
```python
@studenti_bp.route("/", methods=["POST"])
def create_studente():
    data = request.json
    esami_data = data.pop("esami", [])
    esami = []
    for esame in esami_data:
        modulo_data = esame.get("modulo")
        if modulo_data:
            modulo = ModuloSnapshot(**modulo_data)  # ← Oggetto classe
            esame["modulo"] = modulo
        esami.append(EsameEmbedded(**esame))  # ← Oggetto classe
    studente = Studente(**data, esami=esami)  # ← Oggetto classe
    studente.save()  # ← Metodo MongoEngine
    result = studente.to_mongo().to_dict()
    result["_id"] = str(result["_id"])
    return jsonify(result), 201
```

**DOPO (PyMongo):**
```python
@studenti_bp.route("/", methods=["POST"])
def create_studente():
    db = current_app.config["MONGO_DB"]
    data = request.json
    
    # Gli esami rimangono dizionari annidati, non serve crearli come oggetti
    # PyMongo li salva direttamente come embedded documents
    
    result = db.studenti.insert_one(data)  # ← Inserimento diretto
    data["_id"] = str(result.inserted_id)  # ← ID generato da MongoDB
    return jsonify(data), 201
```

**Cosa noti:**
- ❌ Non serve più creare `ModuloSnapshot`, `EsameEmbedded` come oggetti
- ✅ Gli embedded documents sono semplici **dizionari annidati**
- ✅ PyMongo li salva automaticamente nella struttura corretta
- ✅ Molto meno codice!
- ✅ `result.inserted_id` contiene l'ObjectId del documento creato

---

### 3. GET - Dettaglio studente

**PRIMA (MongoEngine):**
```python
@studenti_bp.route("/<string:studente_id>", methods=["GET"])
def get_studente(studente_id):
    studente = Studente.objects(id=studente_id).first()
    if not studente:
        return jsonify({"error": "Studente non trovato"}), 404
    result = studente.to_mongo().to_dict()
    result["_id"] = str(result["_id"])
    return jsonify(result)
```

**DOPO (PyMongo):**
```python
@studenti_bp.route("/<string:studente_id>", methods=["GET"])
def get_studente(studente_id):
    db = current_app.config["MONGO_DB"]
    
    try:
        studente = db.studenti.find_one({"_id": ObjectId(studente_id)})
    except:
        return jsonify({"error": "ID non valido"}), 400
    
    if not studente:
        return jsonify({"error": "Studente non trovato"}), 404
    
    studente["_id"] = str(studente["_id"])
    return jsonify(studente)
```

**Differenze:**
- `Studente.objects(id=...).first()` → `db.studenti.find_one({"_id": ObjectId(...)})`
- Devi convertire la stringa ID in `ObjectId()` manualmente
- Gestione eccezione per ID non valido (try/except)
- `find_one()` restituisce `None` se non trova nulla

---

### 4. PUT - Aggiornamento studente

**PRIMA (MongoEngine):**
```python
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
```

**DOPO (PyMongo):**
```python
@studenti_bp.route("/<string:studente_id>", methods=["PUT"])
def update_studente(studente_id):
    db = current_app.config["MONGO_DB"]
    data = request.json
    
    try:
        result = db.studenti.update_one(
            {"_id": ObjectId(studente_id)},  # ← Filtro query
            {"$set": data}  # ← Operatore MongoDB
        )
    except:
        return jsonify({"error": "ID non valido"}), 400
    
    if result.matched_count == 0:
        return jsonify({"error": "Studente non trovato"}), 404
    
    # Recupera documento aggiornato
    studente = db.studenti.find_one({"_id": ObjectId(studente_id)})
    studente["_id"] = str(studente["_id"])
    return jsonify(studente)
```

**Differenze:**
- `studente.update(**data)` → `db.studenti.update_one(filtro, {"$set": data})`
- `result.matched_count` indica se ha trovato il documento
- Devi convertire manualmente l'ID stringa in `ObjectId()`
- Non serve più gestire manualmente gli embedded documents (già dict)
- Operatore `$set` sostituisce solo i campi specificati

---

### 5. DELETE - Eliminazione studente

**PRIMA (MongoEngine):**
```python
@studenti_bp.route("/<string:studente_id>", methods=["DELETE"])
def delete_studente(studente_id):
    studente = Studente.objects(id=studente_id).first()
    if not studente:
        return jsonify({"error": "Studente non trovato"}), 404
    studente.delete()
    return "", 204
```

**DOPO (PyMongo):**
```python
@studenti_bp.route("/<string:studente_id>", methods=["DELETE"])
def delete_studente(studente_id):
    db = current_app.config["MONGO_DB"]
    
    try:
        result = db.studenti.delete_one({"_id": ObjectId(studente_id)})
    except:
        return jsonify({"error": "ID non valido"}), 400
    
    if result.deleted_count == 0:
        return jsonify({"error": "Studente non trovato"}), 404
    
    return "", 204
```

**Differenze:**
- `studente.delete()` → `db.studenti.delete_one(filtro)`
- `result.deleted_count` indica se ha eliminato qualcosa (0 = non trovato)
- Try/except per gestire ID non validi

---

## Embedded Documents in PyMongo {#embedded}

### Come funzionano gli embedded documents

**Dato JSON in input (POST):**
```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario@email.com",
  "moduliIscritti": ["SO101"],
  "esami": [
    {
      "data": "2025-11-30",
      "voto": 28,
      "note": "Ottimo",
      "modulo": {
        "codice": "SO101",
        "nome": "Sistemi Operativi",
        "ore": 60,
        "descrizione": "Base"
      }
    }
  ]
}
```

### Con MongoEngine
Dovevi creare esplicitamente:
1. `ModuloSnapshot` per ogni modulo
2. `EsameEmbedded` per ogni esame
3. Passarli al costruttore `Studente`

```python
modulo = ModuloSnapshot(**modulo_data)
esame = EsameEmbedded(modulo=modulo, voto=28, ...)
studente = Studente(esami=[esame], ...)
studente.save()
```

### Con PyMongo
**Lo salvi direttamente così com'è!**

```python
db.studenti.insert_one(data)  # Fine!
```

MongoDB capisce automaticamente la struttura annidata e salva:

```javascript
{
  _id: ObjectId("674b8e..."),
  nome: "Mario",
  cognome: "Rossi",
  email: "mario@email.com",
  moduliIscritti: ["SO101"],
  esami: [
    {
      data: "2025-11-30",
      voto: 28,
      note: "Ottimo",
      modulo: {  // ← Embedded automatico!
        codice: "SO101",
        nome: "Sistemi Operativi",
        ore: 60,
        descrizione: "Base"
      }
    }
  ]
}
```

**Vantaggi:**
- ✅ Nessuna conversione necessaria
- ✅ Struttura JSON nativa di MongoDB
- ✅ Più veloce (nessun overhead ODM)
- ✅ Codice più semplice

---

## Operatori MongoDB {#operatori}

Con PyMongo lavori direttamente con gli **operatori MongoDB nativi**.

### Operazioni base

```python
# Ottieni riferimento al database
db = current_app.config["MONGO_DB"]

# --- LETTURA ---

# Trova tutti i documenti
studenti = db.studenti.find()

# Trova uno per ID
studente = db.studenti.find_one({"_id": ObjectId("...")})

# Trova con filtri
studenti_roma = db.studenti.find({"città": "Roma"})

# Conta documenti
totale = db.studenti.count_documents({})

# --- SCRITTURA ---

# Inserisci uno
result = db.studenti.insert_one({
    "nome": "Mario",
    "cognome": "Rossi",
    "email": "mario@email.com"
})
print(result.inserted_id)  # ObjectId generato

# Inserisci molti
result = db.studenti.insert_many([
    {"nome": "Mario", ...},
    {"nome": "Luigi", ...}
])
print(result.inserted_ids)  # Lista di ObjectId

# --- AGGIORNAMENTO ---

# Aggiorna uno (sostituisce campi)
result = db.studenti.update_one(
    {"_id": ObjectId("...")},      # Filtro: quale documento
    {"$set": {"nome": "Luigi"}}    # Azione: cosa modificare
)
print(result.modified_count)  # 1 se modificato, 0 se non trovato

# Aggiorna molti
result = db.studenti.update_many(
    {"città": "Roma"},
    {"$set": {"regione": "Lazio"}}
)

# --- ELIMINAZIONE ---

# Elimina uno
result = db.studenti.delete_one({"_id": ObjectId("...")})
print(result.deleted_count)  # 1 se eliminato, 0 se non trovato

# Elimina molti
result = db.studenti.delete_many({"città": "Roma"})
```

### Operatori MongoDB comuni

```python
# $set - Imposta valore campo
db.studenti.update_one(
    {"_id": ObjectId("...")},
    {"$set": {"nome": "Mario"}}
)

# $push - Aggiungi elemento a array
db.studenti.update_one(
    {"_id": ObjectId("...")},
    {"$push": {"moduliIscritti": "WD201"}}
)

# $pull - Rimuovi elemento da array
db.studenti.update_one(
    {"_id": ObjectId("...")},
    {"$pull": {"moduliIscritti": "WD201"}}
)

# $inc - Incrementa valore numerico
db.statistiche.update_one(
    {"_id": "contatore"},
    {"$inc": {"visite": 1}}
)

# $unset - Rimuovi campo
db.studenti.update_one(
    {"_id": ObjectId("...")},
    {"$unset": {"note": ""}}
)

# $addToSet - Aggiungi a array (solo se non esiste)
db.studenti.update_one(
    {"_id": ObjectId("...")},
    {"$addToSet": {"moduliIscritti": "WD201"}}
)
```

### Query complesse

```python
# Operatori di comparazione
# $eq, $ne, $gt, $gte, $lt, $lte, $in, $nin

# Trova esami con voto >= 24
studenti = db.studenti.find({
    "esami.voto": {"$gte": 24}
})

# Trova studenti iscritti a moduli specifici
studenti = db.studenti.find({
    "moduliIscritti": {"$in": ["SO101", "WD201"]}
})

# Operatori logici
# $and, $or, $not, $nor

# Trova studenti con email Gmail E cognome Rossi
studenti = db.studenti.find({
    "$and": [
        {"email": {"$regex": "@gmail.com$"}},
        {"cognome": "Rossi"}
    ]
})

# Trova studenti con voto 30 O lode
studenti = db.studenti.find({
    "$or": [
        {"esami.voto": 30},
        {"esami.lode": True}
    ]
})

# Operatori su array

# Trova studenti con almeno un esame >= 28
studenti = db.studenti.find({
    "esami": {
        "$elemMatch": {"voto": {"$gte": 28}}
    }
})

# Proiezioni (seleziona solo alcuni campi)
studenti = db.studenti.find(
    {},  # Tutti i documenti
    {"nome": 1, "cognome": 1, "_id": 0}  # Solo nome e cognome, no _id
)

# Ordinamento
studenti = db.studenti.find().sort("cognome", 1)  # 1=ASC, -1=DESC

# Limit e Skip (paginazione)
studenti = db.studenti.find().skip(10).limit(5)  # Pagina 3 (5 per pagina)
```

### Aggregation Pipeline (avanzato)

Per operazioni complesse come calcolo media voti:

```python
# Calcola media voti per studente
pipeline = [
    {"$match": {"_id": ObjectId("...")}},  # Filtro studente
    {"$unwind": "$esami"},                 # Espandi array esami
    {"$group": {                           # Raggruppa
        "_id": "$_id",
        "media": {"$avg": "$esami.voto"}
    }}
]
result = list(db.studenti.aggregate(pipeline))
```

---

## Riepilogo vantaggi e svantaggi {#riepilogo}

| Aspetto | MongoEngine | PyMongo |
|---------|-------------|---------|
| **Sintassi** | Oggetti Python | Dizionari Python |
| **Codice** | Più verboso (crea oggetti) | Più conciso (usa dict) |
| **Validazione** | Automatica con campi tipizzati | Manuale (se necessaria) |
| **Query** | `.objects()` astratto | Query MongoDB dirette |
| **Embedded** | Devi creare classi EmbeddedDocument | Dict annidati automatici |
| **Performance** | Overhead ODM (~10-20% più lento) | Più veloce (driver nativo) |
| **Controllo** | Limitato dall'ODM | Totale su MongoDB |
| **Curva apprendimento** | Più facile per chi conosce OOP | Devi conoscere MongoDB |
| **Debugging** | Più difficile (astrazione) | Più semplice (query dirette) |
| **Flessibilità** | Limitata dallo schema | Totale |

### Quando usare MongoEngine
- ✅ Progetti piccoli/medi con schema stabile
- ✅ Team che preferisce OOP
- ✅ Validazione automatica richiesta
- ✅ Prototipazione rapida

### Quando usare PyMongo
- ✅ Performance critiche
- ✅ Query complesse e aggregazioni
- ✅ Schema flessibile/dinamico
- ✅ Controllo totale sul database
- ✅ Progetti enterprise (come questo!)

---

## Conversione completa - Checklist

### ✅ 1. Aggiornare requirements.txt
```txt
flask
pymongo  # Aggiungi se non presente
mongoengine  # Mantieni per genera_dati.py
```

### ✅ 2. Modificare app/__init__.py
- Rimuovere `mongoengine.connect()`
- Aggiungere `MongoClient` da PyMongo
- Configurare `app.config["MONGO_DB"]`

### ✅ 3. Convertire routes/studenti.py
- Importare `from bson import ObjectId`
- Importare `from flask import current_app`
- Sostituire `Studente.objects()` con `db.studenti.find()`
- Sostituire `.save()` con `.insert_one()`
- Sostituire `.update()` con `.update_one()`
- Sostituire `.delete()` con `.delete_one()`
- Rimuovere gestione manuale embedded documents

### ✅ 4. Creare routes/moduli.py (nuovo)
- Implementare CRUD completo con PyMongo
- Seguire stesso pattern di studenti.py

### ✅ 5. Mantenere models/ e genera_dati.py
- Non modificare le classi MongoEngine
- `genera_dati.py` continua a usare MongoEngine

### ✅ 6. Testare con Postman
- Verificare tutti gli endpoint CRUD
- Controllare embedded documents
- Testare gestione errori (404, 400)

---

## Esempio completo: file studenti.py convertito

```python
from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId

studenti_bp = Blueprint("studenti", __name__)


@studenti_bp.route("/", methods=["GET"])
def get_studenti():
    """Lista tutti gli studenti"""
    db = current_app.config["MONGO_DB"]
    studenti = list(db.studenti.find())
    for s in studenti:
        s["_id"] = str(s["_id"])
    return jsonify(studenti)


@studenti_bp.route("/", methods=["POST"])
def create_studente():
    """Crea nuovo studente"""
    db = current_app.config["MONGO_DB"]
    data = request.json
    
    # Validazione base (opzionale)
    if not data.get("nome") or not data.get("email"):
        return jsonify({"error": "Campi obbligatori mancanti"}), 400
    
    result = db.studenti.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return jsonify(data), 201


@studenti_bp.route("/<string:studente_id>", methods=["GET"])
def get_studente(studente_id):
    """Dettaglio studente"""
    db = current_app.config["MONGO_DB"]
    
    try:
        studente = db.studenti.find_one({"_id": ObjectId(studente_id)})
    except:
        return jsonify({"error": "ID non valido"}), 400
    
    if not studente:
        return jsonify({"error": "Studente non trovato"}), 404
    
    studente["_id"] = str(studente["_id"])
    return jsonify(studente)


@studenti_bp.route("/<string:studente_id>", methods=["PUT"])
def update_studente(studente_id):
    """Aggiorna studente"""
    db = current_app.config["MONGO_DB"]
    data = request.json
    
    try:
        result = db.studenti.update_one(
            {"_id": ObjectId(studente_id)},
            {"$set": data}
        )
    except:
        return jsonify({"error": "ID non valido"}), 400
    
    if result.matched_count == 0:
        return jsonify({"error": "Studente non trovato"}), 404
    
    studente = db.studenti.find_one({"_id": ObjectId(studente_id)})
    studente["_id"] = str(studente["_id"])
    return jsonify(studente)


@studenti_bp.route("/<string:studente_id>", methods=["DELETE"])
def delete_studente(studente_id):
    """Elimina studente"""
    db = current_app.config["MONGO_DB"]
    
    try:
        result = db.studenti.delete_one({"_id": ObjectId(studente_id)})
    except:
        return jsonify({"error": "ID non valido"}), 400
    
    if result.deleted_count == 0:
        return jsonify({"error": "Studente non trovato"}), 404
    
    return "", 204
```

---

## Conclusione

La conversione da MongoEngine a PyMongo comporta:

1. **Meno codice** - nessuna conversione oggetti/dict
2. **Più velocità** - accesso diretto a MongoDB
3. **Più controllo** - operatori MongoDB nativi
4. **Più responsabilità** - gestione manuale validazione e ObjectId

È un passaggio che aumenta le performance e la flessibilità del progetto, mantenendo la possibilità di usare MongoEngine per il caricamento iniziale dei dati.
