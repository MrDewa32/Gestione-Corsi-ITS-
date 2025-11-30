# Rotte Studente - Spiegazione dettagliata

Questo file spiega in dettaglio le rotte attualmente presenti in `routes/studenti.py` per la gestione degli studenti.

---

## 1. GET /studenti
Restituisce la lista di tutti gli studenti presenti nel database.

```python
def get_studenti():
    studenti = Studente.objects()
    return jsonify([s.to_mongo().to_dict() for s in studenti])
```
- `Studente.objects()` recupera tutti gli studenti dal database.
- `[s.to_mongo().to_dict() for s in studenti]` trasforma ogni oggetto Studente in un dizionario serializzabile in JSON.
- `jsonify(...)` restituisce la lista in formato JSON.

---

## 2. POST /studenti
Crea un nuovo studente con i dati forniti dal client.

```python
def create_studente():
    data = request.json
    studente = Studente(**data)
    studente.save()
    return jsonify(studente.to_mongo().to_dict()), 201
```
- `data = request.json` prende i dati inviati dal client in formato JSON.
- `Studente(**data)` crea un nuovo oggetto Studente usando i dati ricevuti.
- `studente.save()` salva il nuovo studente nel database.
- `jsonify(studente.to_mongo().to_dict()), 201` restituisce lo studente creato in JSON e lo status HTTP 201 (Created).

---

## 2b. POST /studenti (versione avanzata)
Gestisce la creazione di uno studente con esami embedded e moduli snapshot.

```python
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
    return jsonify(studente.to_mongo().to_dict()), 201
```
- Permette di creare studenti con esami annidati e snapshot del modulo.
- Necessario perché mongoengine richiede oggetti embedded, non semplici dizionari.

---

## 3. GET /studenti/<studente_id>
Restituisce i dati di uno studente specifico, cercato per id.

```python
def get_studente(studente_id):
    studente = Studente.objects(id=studente_id).first()
    if not studente:
        return jsonify({"error": "Studente non trovato"}), 404
    return jsonify(studente.to_mongo().to_dict())
```
- `Studente.objects(id=studente_id).first()` cerca lo studente con l'id specificato.
- Se non trovato, restituisce errore 404.
- Altrimenti, restituisce i dati dello studente in formato JSON.

---

## 4. PUT /studenti/<studente_id>
Aggiorna i dati di uno studente esistente.

```python
def update_studente(studente_id):
    data = request.json
    studente = Studente.objects(id=studente_id).first()
    if not studente:
        return jsonify({"error": "Studente non trovato"}), 404
    studente.update(**data)
    studente.reload()
    return jsonify(studente.to_mongo().to_dict())
```
- `data = request.json` prende i nuovi dati dal client.
- Cerca lo studente per id.
- Se non trovato, restituisce errore 404.
- `studente.update(**data)` aggiorna i campi dello studente.
- `studente.reload()` ricarica i dati aggiornati dal database.
- Restituisce lo studente aggiornato in JSON.

---

## 4b. PUT /studenti/<studente_id> (versione avanzata)
Gestisce l'aggiornamento di uno studente con esami embedded e moduli snapshot.

```python
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
    return jsonify(studente.to_mongo().to_dict())
```
- Permette di aggiornare studenti con esami annidati e snapshot del modulo.
- Necessario per garantire la coerenza dei dati embedded in mongoengine.

**Nota:** Le versioni avanzate sono state aggiunte per supportare la gestione di dati complessi (esami e moduli embedded) come richiesto dalla traccia e per evitare errori di serializzazione con mongoengine.

---

## 5. DELETE /studenti/<studente_id>
Elimina uno studente dal database.

```python
def delete_studente(studente_id):
    studente = Studente.objects(id=studente_id).first()
    if not studente:
        return jsonify({"error": "Studente non trovato"}), 404
    studente.delete()
    return "", 204
```
- Cerca lo studente per id.
- Se non trovato, restituisce errore 404.
- `studente.delete()` elimina lo studente dal database.
- Restituisce risposta vuota con status 204 (No Content).

---

Queste rotte gestiscono le operazioni CRUD di base sugli studenti. Per gestire dati più complessi (esami, iscrizioni, media voti) serviranno modifiche aggiuntive.