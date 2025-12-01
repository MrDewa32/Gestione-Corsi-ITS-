# Documentazione Routes Studenti - PyMongo

Questo documento descrive tutte le route per la gestione degli studenti implementate con **PyMongo** (driver nativo MongoDB).

---

## Indice
1. [GET /studenti/ - Lista studenti](#get-lista)
2. [POST /studenti/ - Crea studente](#post-crea)
3. [GET /studenti/<id> - Dettaglio studente](#get-dettaglio)
4. [PUT /studenti/<id> - Aggiorna studente](#put-aggiorna)
5. [DELETE /studenti/<id> - Elimina studente](#delete-elimina)
6. [Note tecniche importanti](#note-tecniche)

---

## 1. GET /studenti/ - Lista tutti gli studenti {#get-lista}

### Endpoint
```
GET http://127.0.0.1:5000/studenti/
```

### Descrizione
Restituisce l'elenco completo di tutti gli studenti presenti nel database.

### Codice
```python
@studenti_bp.route("/", methods=["GET"])
def get_studenti():
    """Lista tutti gli studenti"""
    db = current_app.config["MONGO_DB"]
    studenti = list(db.studente.find())  # Usa collection 'studente'
    for s in studenti:
        s["_id"] = str(s["_id"])  # Conversione ObjectId -> stringa
    return jsonify(studenti)
```

### Spiegazione
1. **`current_app.config["MONGO_DB"]`** - Ottiene il database MongoDB configurato in `app/__init__.py`
2. **`db.studente.find()`** - Query PyMongo che restituisce un cursore con tutti i documenti della collection `studente`
3. **`list(...)`** - Converte il cursore MongoDB in lista Python
4. **`s["_id"] = str(s["_id"])`** - Converte l'ObjectId MongoDB in stringa per la serializzazione JSON
5. **`jsonify(studenti)`** - Restituisce la lista come risposta JSON

### Risposta di successo
**Status:** `200 OK`

```json
[
  {
    "_id": "674c3a1b2f8d9e0012345678",
    "nome": "Mario",
    "cognome": "Rossi",
    "email": "mario.rossi@email.com",
    "moduliIscritti": ["SO101", "WD201"],
    "esami": [
      {
        "data": "2025-11-15",
        "voto": 28,
        "note": "Ottimo",
        "modulo": {
          "codice": "SO101",
          "nome": "Sistemi Operativi",
          "ore": 60,
          "descrizione": "Corso base"
        }
      }
    ]
  }
]
```

### Note
- Se il database è vuoto, restituisce array vuoto `[]`
- Gli **embedded documents** (esami e modulo) sono già inclusi automaticamente
- **Collection name:** `studente` (singolare) - creata da MongoEngine

---

## 2. POST /studenti/ - Crea nuovo studente {#post-crea}

### Endpoint
```
POST http://127.0.0.1:5000/studenti/
Content-Type: application/json
```

### Descrizione
Crea un nuovo studente nel database con dati personali, moduli iscritti ed esami sostenuti.

### Codice
```python
@studenti_bp.route("/", methods=["POST"])
def create_studente():
    """Crea nuovo studente con embedded documents"""
    db = current_app.config["MONGO_DB"]
    data = request.json
    
    # Validazione base
    if not data.get("nome") or not data.get("email"):
        return jsonify({"error": "Nome ed email sono obbligatori"}), 400
    
    # PyMongo gestisce automaticamente gli embedded documents come dict annidati
    result = db.studente.insert_one(data)
    data["_id"] = str(result.inserted_id)
    return jsonify(data), 201
```

### Spiegazione
1. **`request.json`** - Estrae il JSON dal body della richiesta HTTP
2. **Validazione** - Verifica che i campi obbligatori (`nome`, `email`) siano presenti
3. **`db.studente.insert_one(data)`** - Inserisce il documento nel database MongoDB
   - **Nessuna conversione necessaria!** PyMongo salva automaticamente dict annidati come embedded documents
4. **`result.inserted_id`** - MongoDB genera automaticamente un ObjectId per il nuovo documento
5. **`str(result.inserted_id)`** - Converte l'ObjectId in stringa per la risposta JSON
6. **Status `201 Created`** - Indica che la risorsa è stata creata con successo

### Body richiesta
```json
{
  "nome": "Giovanni",
  "cognome": "Bianchi",
  "email": "giovanni.bianchi@email.com",
  "moduliIscritti": ["WD201", "DB301"],
  "esami": [
    {
      "data": "2025-12-01",
      "voto": 27,
      "note": "Buona prova",
      "modulo": {
        "codice": "WD201",
        "nome": "Web Development",
        "ore": 80,
        "descrizione": "Corso avanzato"
      }
    }
  ]
}
```

### Risposta di successo
**Status:** `201 Created`

```json
{
  "_id": "674c4f2a3e9d1a0023456789",
  "nome": "Giovanni",
  "cognome": "Bianchi",
  "email": "giovanni.bianchi@email.com",
  "moduliIscritti": ["WD201", "DB301"],
  "esami": [
    {
      "data": "2025-12-01",
      "voto": 27,
      "note": "Buona prova",
      "modulo": {
        "codice": "WD201",
        "nome": "Web Development",
        "ore": 80,
        "descrizione": "Corso avanzato"
      }
    }
  ]
}
```

### Risposta di errore
**Status:** `400 Bad Request`

```json
{
  "error": "Nome ed email sono obbligatori"
}
```

### Vantaggi PyMongo
Con **MongoEngine** dovevi creare manualmente:
```python
modulo = ModuloSnapshot(**modulo_data)
esame = EsameEmbedded(modulo=modulo, ...)
studente = Studente(esami=[esame], ...)
```

Con **PyMongo** il JSON viene salvato direttamente - MongoDB capisce automaticamente la struttura annidata!

---

## 3. GET /studenti/<id> - Dettaglio studente {#get-dettaglio}

### Endpoint
```
GET http://127.0.0.1:5000/studenti/674c3a1b2f8d9e0012345678
```

### Descrizione
Restituisce i dettagli completi di un singolo studente identificato dal suo `_id`.

### Codice
```python
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
```

### Spiegazione
1. **`<string:studente_id>`** - Parametro URL che cattura l'ID dello studente
2. **`ObjectId(studente_id)`** - Converte la stringa ID in ObjectId MongoDB (necessario per la query)
3. **`try/except`** - Gestisce il caso di ID malformato (es. "abc123" invece di un ObjectId valido)
4. **`find_one({"_id": ...})`** - Cerca un singolo documento con quell'ID
   - Restituisce `None` se non trova nulla
5. **Status `404`** - Se lo studente non esiste
6. **Status `400`** - Se l'ID non è un ObjectId valido

### Risposta di successo
**Status:** `200 OK`

```json
{
  "_id": "674c3a1b2f8d9e0012345678",
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario.rossi@email.com",
  "moduliIscritti": ["SO101"],
  "esami": [
    {
      "data": "2025-11-15",
      "voto": 28,
      "note": "Ottimo",
      "modulo": {
        "codice": "SO101",
        "nome": "Sistemi Operativi",
        "ore": 60,
        "descrizione": "Corso base"
      }
    }
  ]
}
```

### Risposte di errore

**Status:** `404 Not Found` (studente non esiste)
```json
{
  "error": "Studente non trovato"
}
```

**Status:** `400 Bad Request` (ID non valido)
```json
{
  "error": "ID non valido"
}
```

### Differenza con MongoEngine
- **MongoEngine:** `Studente.objects(id=studente_id).first()`
- **PyMongo:** `db.studente.find_one({"_id": ObjectId(studente_id)})`

PyMongo richiede la conversione manuale in `ObjectId`, ma è più esplicito e controllabile.

---

## 4. PUT /studenti/<id> - Aggiorna studente {#put-aggiorna}

### Endpoint
```
PUT http://127.0.0.1:5000/studenti/674c3a1b2f8d9e0012345678
Content-Type: application/json
```

### Descrizione
Aggiorna i dati di uno studente esistente. Supporta **aggiornamenti parziali** (puoi modificare solo alcuni campi).

### Codice
```python
@studenti_bp.route("/<string:studente_id>", methods=["PUT"])
def update_studente(studente_id):
    """Aggiorna studente esistente"""
    db = current_app.config["MONGO_DB"]
    data = request.json
    
    try:
        result = db.studente.update_one(
            {"_id": ObjectId(studente_id)},  # Filtro: quale documento
            {"$set": data}                   # Operatore: cosa modificare
        )
    except:
        return jsonify({"error": "ID non valido"}), 400
    
    if result.matched_count == 0:
        return jsonify({"error": "Studente non trovato"}), 404
    
    # Recupera documento aggiornato
    studente = db.studente.find_one({"_id": ObjectId(studente_id)})
    studente["_id"] = str(studente["_id"])
    return jsonify(studente)
```

### Spiegazione
1. **`update_one(filtro, operazione)`** - Metodo PyMongo per aggiornare un documento
   - **Primo parametro:** Filtro per trovare il documento (query per `_id`)
   - **Secondo parametro:** Operazione da eseguire
2. **`{"$set": data}`** - Operatore MongoDB che **sostituisce solo i campi specificati**
   - Altri campi rimangono invariati (aggiornamento parziale)
3. **`result.matched_count`** - Numero di documenti trovati (0 = non esiste)
4. **`result.modified_count`** - Numero di documenti modificati
5. **Recupero documento** - Dopo l'aggiornamento, rilegge il documento per restituire lo stato finale

### Body richiesta (aggiornamento parziale)
```json
{
  "cognome": "Verdi",
  "email": "mario.verdi@newemail.com"
}
```

**Nota:** Solo `cognome` e `email` verranno modificati. `nome`, `moduliIscritti` ed `esami` rimangono invariati.

### Body richiesta (aggiornamento esami)
```json
{
  "esami": [
    {
      "data": "2025-11-15",
      "voto": 28,
      "note": "Ottimo",
      "modulo": {
        "codice": "SO101",
        "nome": "Sistemi Operativi",
        "ore": 60,
        "descrizione": "Corso base"
      }
    },
    {
      "data": "2025-12-01",
      "voto": 30,
      "note": "Eccellente",
      "modulo": {
        "codice": "WD201",
        "nome": "Web Development",
        "ore": 80,
        "descrizione": "Avanzato"
      }
    }
  ]
}
```

**Nota:** Con PyMongo, gli embedded documents sono semplici dict - nessuna classe da istanziare!

### Risposta di successo
**Status:** `200 OK`

```json
{
  "_id": "674c3a1b2f8d9e0012345678",
  "nome": "Mario",
  "cognome": "Verdi",
  "email": "mario.verdi@newemail.com",
  "moduliIscritti": ["SO101"],
  "esami": [...]
}
```

### Risposte di errore

**Status:** `404 Not Found`
```json
{
  "error": "Studente non trovato"
}
```

**Status:** `400 Bad Request`
```json
{
  "error": "ID non valido"
}
```

### Operatori MongoDB utili

```python
# Sostituisci campi (quello che usiamo)
{"$set": {"nome": "Mario"}}

# Aggiungi elemento a array
{"$push": {"moduliIscritti": "DB301"}}

# Rimuovi elemento da array
{"$pull": {"moduliIscritti": "SO101"}}

# Incrementa valore numerico
{"$inc": {"crediti": 5}}

# Rimuovi campo
{"$unset": {"note": ""}}
```

---

## 5. DELETE /studenti/<id> - Elimina studente {#delete-elimina}

### Endpoint
```
DELETE http://127.0.0.1:5000/studenti/674c3a1b2f8d9e0012345678
```

### Descrizione
Elimina definitivamente uno studente dal database.

### Codice
```python
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
```

### Spiegazione
1. **`delete_one(filtro)`** - Elimina un singolo documento che corrisponde al filtro
2. **`result.deleted_count`** - Numero di documenti eliminati
   - `0` = documento non trovato
   - `1` = documento eliminato con successo
3. **Status `204 No Content`** - Successo senza corpo nella risposta (standard REST)
4. **`return "", 204`** - Risposta vuota con status code 204

### Risposta di successo
**Status:** `204 No Content`

Nessun body nella risposta (risposta vuota).

### Risposte di errore

**Status:** `404 Not Found`
```json
{
  "error": "Studente non trovato"
}
```

**Status:** `400 Bad Request`
```json
{
  "error": "ID non valido"
}
```

### ⚠️ Attenzione
L'eliminazione è **permanente** e non può essere annullata. Non c'è soft delete implementato.

---

## Note tecniche importanti {#note-tecniche}

### 1. Collection name: `studente` vs `studenti`

**Problema comune:**
```python
db.studenti.find()  # ❌ Collection vuota!
db.studente.find()  # ✅ Dati presenti
```

**Motivo:** MongoEngine crea automaticamente il nome della collection dal nome della classe:
- Classe: `Studente` → Collection: `studente` (singolare minuscolo)
- Classe: `Modulo` → Collection: `modulo`

**Soluzione:** Usa sempre `db.studente` nelle route PyMongo per leggere i dati creati da MongoEngine.

---

### 2. Conversione ObjectId → String

**Problema:**
```python
return jsonify(studente)  # ❌ TypeError: Object of type ObjectId is not JSON serializable
```

**Soluzione:**
```python
studente["_id"] = str(studente["_id"])  # ✅ Converte ObjectId in stringa
return jsonify(studente)
```

**Perché:** MongoDB usa `ObjectId` per gli `_id`, ma JSON supporta solo tipi primitivi (string, number, etc.).

---

### 3. Import necessari

```python
from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId  # IMPORTANTE per convertire ID
```

**`bson.ObjectId`** è essenziale per:
- Convertire stringhe in ObjectId per le query
- Gestire la validazione degli ID

---

### 4. Embedded Documents automatici

**Con MongoEngine (prima):**
```python
# Dovevi creare classi
modulo = ModuloSnapshot(**modulo_data)
esame = EsameEmbedded(modulo=modulo, voto=28, ...)
studente = Studente(esami=[esame])
studente.save()
```

**Con PyMongo (ora):**
```python
# Salvi direttamente il JSON
data = {
    "nome": "Mario",
    "esami": [
        {
            "voto": 28,
            "modulo": {
                "codice": "SO101",
                "nome": "Sistemi"
            }
        }
    ]
}
db.studente.insert_one(data)  # Fine!
```

MongoDB capisce automaticamente la struttura annidata e salva tutto come embedded documents.

---

### 5. Gestione errori

Tutti gli endpoint gestiscono due tipi di errore principali:

**400 Bad Request:**
- ID non è un ObjectId valido
- Campi obbligatori mancanti

**404 Not Found:**
- Studente con quell'ID non esiste

**Esempio:**
```python
try:
    result = db.studente.find_one({"_id": ObjectId(studente_id)})
except:
    return jsonify({"error": "ID non valido"}), 400  # ObjectId malformato

if not result:
    return jsonify({"error": "Studente non trovato"}), 404  # ID valido ma inesistente
```

---

### 6. Accesso al database

In tutte le route:
```python
db = current_app.config["MONGO_DB"]
```

Questo recupera il database configurato in `app/__init__.py`:
```python
client = MongoClient(host="localhost", port=27017)
app.config["MONGO_DB"] = client["Gestione-Corsi-ITS"]
```

---

### 7. Status codes HTTP

| Operazione | Successo | Errore cliente | Errore server |
|------------|----------|----------------|---------------|
| GET lista  | 200      | -              | 500           |
| GET dettaglio | 200   | 404, 400       | 500           |
| POST       | 201      | 400            | 500           |
| PUT        | 200      | 404, 400       | 500           |
| DELETE     | 204      | 404, 400       | 500           |

---

## Vantaggi PyMongo vs MongoEngine

| Aspetto | MongoEngine | PyMongo |
|---------|-------------|---------|
| **Codice POST** | ~20 righe (crea oggetti) | ~10 righe (insert diretto) |
| **Embedded docs** | Classi obbligatorie | Dict automatici |
| **Query** | `.objects()` astratto | Query MongoDB native |
| **Performance** | Overhead ODM | Più veloce (~20%) |
| **Debugging** | Difficile (astrazione) | Semplice (query dirette) |
| **Flessibilità** | Schema rigido | Schema flessibile |

---

## Testing con Postman

### Sequenza di test completa

1. **GET lista** → Verifica dati esistenti
2. **POST crea** → Copia l'`_id` dalla risposta
3. **GET dettaglio** → Usa l'ID copiato
4. **PUT aggiorna** → Modifica alcuni campi
5. **GET dettaglio** → Verifica modifiche
6. **DELETE elimina** → Usa lo stesso ID
7. **GET dettaglio** → Verifica 404

### Comandi PowerShell alternativi

```powershell
# GET lista
Invoke-WebRequest -Uri "http://127.0.0.1:5000/studenti/" -Method GET

# POST crea
$body = @{
    nome = "Test"
    cognome = "Utente"
    email = "test@email.com"
    moduliIscritti = @()
    esami = @()
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:5000/studenti/" -Method POST -Body $body -ContentType "application/json"

# DELETE
Invoke-WebRequest -Uri "http://127.0.0.1:5000/studenti/<ID>" -Method DELETE
```

---

## Prossimi sviluppi

Funzionalità avanzate da implementare (dalla traccia):

1. **CRUD Moduli** - Routes per gestire i corsi
2. **Iscrizione automatica** - `POST /studenti/<id>/iscriviti/<codice_modulo>`
3. **Calcolo media voti** - `GET /studenti/<id>/media`
4. **Filtro esami eccellenti** - `GET /studenti/<id>/esami-eccellenti` (voto >= 24)

---

## Conclusione

Le routes studenti con PyMongo sono:
- ✅ **Più veloci** - Nessun overhead ODM
- ✅ **Più semplici** - Meno codice per embedded documents
- ✅ **Più flessibili** - Query MongoDB native
- ✅ **Più esplicite** - Controllo totale sulle operazioni

Il codice è passato da ~80 righe (MongoEngine) a ~60 righe (PyMongo) mantenendo tutte le funzionalità e migliorando le performance.
