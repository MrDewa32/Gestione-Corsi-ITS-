# Changelog Rotte Studenti

Questo documento spiega le modifiche apportate alle rotte degli studenti e i motivi dei cambiamenti.

---

## 1. GET /studenti/ - Lista tutti gli studenti

### ❌ Versione Originale (NON funzionante)
```python
@studenti_bp.route("/", methods=["GET"])
def get_studenti():
    studenti = Studente.objects()
    return jsonify([s.to_mongo().to_dict() for s in studenti])
```

### ✅ Versione Aggiornata (Funzionante)
```python
@studenti_bp.route("/", methods=["GET"])
def get_studenti():
    studenti = Studente.objects()
    result = []
    for s in studenti:
        data = s.to_mongo().to_dict()
        data["_id"] = str(data["_id"])
        result.append(data)
    return jsonify(result)
```

### 🔧 Motivo del cambiamento
**Problema:** MongoDB restituisce il campo `_id` come tipo `ObjectId`, che non è serializzabile in JSON. Flask generava l'errore: `TypeError: Object of type ObjectId is not JSON serializable`

**Soluzione:** Convertire esplicitamente `_id` in stringa prima di chiamare `jsonify()`. Questo rende l'oggetto completamente serializzabile.

---

## 2. POST /studenti/ - Crea nuovo studente

### ❌ Versione Base (Limitata)
```python
@studenti_bp.route("/", methods=["POST"])
def create_studente():
    data = request.json
    studente = Studente(**data)
    studente.save()
    return jsonify(studente.to_mongo().to_dict()), 201
```

**Limitazione:** Non gestiva correttamente gli esami embedded con ModuloSnapshot, causando errori di validazione MongoEngine.

### ✅ Versione Aggiornata (Completa)
```python
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
```

### 🔧 Motivi dei cambiamenti

1. **Gestione esami embedded:** Separa i dati degli esami dal resto (`data.pop("esami", [])`) per processarli correttamente
2. **Costruzione ModuloSnapshot:** Crea esplicitamente oggetti `ModuloSnapshot` per ogni esame, necessario per la validazione di MongoEngine
3. **Costruzione EsameEmbedded:** Crea oggetti `EsameEmbedded` con il ModuloSnapshot già inizializzato
4. **Conversione ObjectId:** Aggiunge `result["_id"] = str(result["_id"])` per risolvere l'errore di serializzazione JSON

---

## 3. GET /studenti/<id> - Dettaglio studente

### ❌ Versione Originale (NON funzionante)
```python
@studenti_bp.route("/<string:studente_id>", methods=["GET"])
def get_studente(studente_id):
    studente = Studente.objects(id=studente_id).first()
    if not studente:
        return jsonify({"error": "Studente non trovato"}), 404
    return jsonify(studente.to_mongo().to_dict())
```

### ✅ Versione Aggiornata (Funzionante)
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

### 🔧 Motivo del cambiamento
Stesso problema di serializzazione ObjectId della route GET /studenti/. La soluzione è identica: convertire `_id` in stringa prima della serializzazione JSON.

---

## 4. PUT /studenti/<id> - Aggiorna studente

### ❌ Versione Base (Limitata)
```python
@studenti_bp.route("/<string:studente_id>", methods=["PUT"])
def update_studente(studente_id):
    data = request.json
    studente = Studente.objects(id=studente_id).first()
    if not studente:
        return jsonify({"error": "Studente non trovato"}), 404
    studente.update(**data)
    studente.reload()
    return jsonify(studente.to_mongo().to_dict())
```

**Limitazioni:** 
- Non gestiva aggiornamenti di esami embedded con ModuloSnapshot
- Errore di serializzazione ObjectId

### ✅ Versione Aggiornata (Completa)
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

### 🔧 Motivi dei cambiamenti

1. **Gestione condizionale esami:** Usa `data.pop("esami", None)` e verifica `if esami_data is not None` per permettere aggiornamenti anche senza modificare gli esami
2. **Costruzione embedded documents:** Stessa logica del POST per creare correttamente ModuloSnapshot e EsameEmbedded
3. **Conversione ObjectId:** Aggiunge la conversione a stringa per la serializzazione JSON
4. **Flessibilità:** Permette di aggiornare solo alcuni campi (nome, email) senza dover reinviare tutti gli esami

---

## 5. DELETE /studenti/<id> - Elimina studente

### ✅ Versione Attuale (Già funzionante)
```python
@studenti_bp.route("/<string:studente_id>", methods=["DELETE"])
def delete_studente(studente_id):
    studente = Studente.objects(id=studente_id).first()
    if not studente:
        return jsonify({"error": "Studente non trovato"}), 404
    studente.delete()
    return "", 204
```

### 🔧 Nessun cambiamento necessario
Questa route funzionava correttamente già dalla prima versione perché:
- Non restituisce dati JSON (solo status 204 No Content)
- Non ha problemi di serializzazione ObjectId
- Gestisce correttamente il caso 404

---

## Riepilogo problemi risolti

### 1. ❌ TypeError: Object of type ObjectId is not JSON serializable
**Cause:** MongoDB usa `ObjectId` per il campo `_id`, che non è un tipo JSON nativo.

**Soluzione applicata:** Convertire esplicitamente in stringa:
```python
result["_id"] = str(result["_id"])
```

**Route interessate:** GET /, POST /, GET /<id>, PUT /<id>

---

### 2. ❌ ValidationError con EmbeddedDocument
**Cause:** MongoEngine richiede che i documenti embedded (EsameEmbedded e ModuloSnapshot) siano istanze di classi specifiche, non semplici dizionari.

**Soluzione applicata:** Creare esplicitamente le istanze:
```python
modulo = ModuloSnapshot(**modulo_data)
esame = EsameEmbedded(modulo=modulo, **other_fields)
```

**Route interessate:** POST /, PUT /<id>

---

### 3. ❌ Duplicazione percorso route
**Problema precedente (già risolto):** Le route erano definite come `@route("/studenti")` con Blueprint registrato con `url_prefix="/studenti"`, creando percorsi doppi `/studenti/studenti`.

**Soluzione applicata:** Usare `@route("/")` nel Blueprint, il prefisso viene aggiunto automaticamente.

**Risultato:** Percorsi corretti come `/studenti/`, `/studenti/<id>`

---

## Best Practices implementate

1. ✅ **Conversione ObjectId:** Sempre convertire `_id` a stringa prima di jsonify
2. ✅ **Gestione 404:** Verificare esistenza documento prima di operazioni
3. ✅ **Embedded Documents:** Costruire esplicitamente istanze MongoEngine
4. ✅ **Codici HTTP corretti:** 200 (OK), 201 (Created), 204 (No Content), 404 (Not Found)
5. ✅ **Separazione logica:** Processare esami separatamente dal resto dei dati
6. ✅ **Flessibilità aggiornamenti:** Permettere aggiornamenti parziali (es. solo nome/email)

---

## Testing delle route

Tutte le route sono state testate con Postman e restituiscono correttamente:

- ✅ GET /studenti/ - Status 200, lista studenti con _id come stringa
- ✅ POST /studenti/ - Status 201, studente creato con esami embedded
- ✅ GET /studenti/<id> - Status 200, dettaglio completo studente
- ✅ PUT /studenti/<id> - Status 200, studente aggiornato
- ✅ DELETE /studenti/<id> - Status 204, studente eliminato
- ✅ GET /studenti/<id_inesistente> - Status 404, messaggio errore appropriato
