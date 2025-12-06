# 📋 TODO Backend - Gestione Corsi ITS

## 🔴 **PRIORITÀ ALTA**

### ✅ Aggiungere campo `matricola` agli studenti

**Obiettivo:** Ogni studente deve avere una matricola univoca nel database MongoDB.

#### **Opzione 1: Aggiungere matricola agli studenti esistenti**

Esegui questo script Python per aggiornare tutti gli studenti già presenti:

```python
# Script: aggiungi_matricola.py
from pymongo import MongoClient

# Connessione al database
client = MongoClient("mongodb://localhost:27017/")
db = client["nome_tuo_database"]  # ← Cambia con il nome del tuo DB

# Trova tutti gli studenti senza matricola
studenti = db.studente.find({"matricola": {"$exists": False}})

# Genera e aggiungi matricola
numero_iniziale = 1001
for i, studente in enumerate(studenti, start=numero_iniziale):
    matricola = f"MAT{i:04d}"  # Formato: MAT1001, MAT1002, ecc.
    
    db.studente.update_one(
        {"_id": studente["_id"]},
        {"$set": {"matricola": matricola}}
    )
    
    print(f"✅ Aggiunta matricola {matricola} a {studente.get('nome')} {studente.get('cognome')}")

print(f"\n✅ Completato! Aggiornati {i - numero_iniziale + 1} studenti")
client.close()
```

**Come eseguire:**
```bash
cd Backend
python aggiungi_matricola.py
```

---

#### **Opzione 2: Generare matricola automaticamente alla creazione**

Modifica la route POST in `app/routes/studenti.py`:

```python
@studenti_bp.route("/", methods=["POST"])
def create_studente():
    """Crea nuovo studente con matricola automatica"""
    db = current_app.config["MONGO_DB"]
    data = request.json

    if not data.get("nome") or not data.get("email"):
        return jsonify({"error": "Nome ed email sono obbligatori"}), 400

    # 🆕 GENERA MATRICOLA AUTOMATICA
    # Trova l'ultima matricola usata
    ultimo_studente = db.studente.find_one(
        {"matricola": {"$exists": True}},
        sort=[("matricola", -1)]
    )
    
    if ultimo_studente and "matricola" in ultimo_studente:
        # Estrai il numero dalla matricola (es. "MAT1005" -> 1005)
        ultimo_numero = int(ultimo_studente["matricola"][3:])
        nuovo_numero = ultimo_numero + 1
    else:
        # Prima matricola
        nuovo_numero = 1001
    
    # Genera la nuova matricola
    data["matricola"] = f"MAT{nuovo_numero:04d}"
    
    # Inserisci nel database
    result = db.studente.insert_one(data)
    data["_id"] = str(result.inserted_id)
    
    return jsonify(data), 201
```

---

#### **Opzione 3: Aggiungere al file JSON di default**

Modifica `dati default/studenti_Version3.json` aggiungendo il campo matricola:

```json
{
  "matricola": "MAT1001",
  "nome": "Marco",
  "cognome": "Fontana",
  "email": "marco.fontana@email.com",
  ...
}
```

---

### **Formato suggerito per la matricola:**
- `MAT` + numero a 4 cifre: `MAT1001`, `MAT1002`, ecc.
- Oppure con anno: `MAT2025001`, `MAT2025002`, ecc.
- Oppure personalizzato in base alle tue esigenze

---

## 🟡 **PRIORITÀ MEDIA**

### 🔧 Validazione campi obbligatori
- Assicurarsi che `nome`, `cognome`, `email` siano sempre presenti
- Validare formato email
- Validare che `moduliIscritti` sia un array valido

### 🔒 Autenticazione e Autorizzazione
- Implementare JWT per proteggere le API
- Creare middleware di autenticazione
- Gestire ruoli (admin, docente, studente)

### 📊 Endpoint statistiche
- Media voti per studente
- Numero studenti per modulo
- Report presenze/assenze

---

## 🟢 **MIGLIORAMENTI FUTURI**

### 📁 Upload file
- Caricamento documenti studenti
- Upload foto profilo
- Gestione certificati

### 🔔 Notifiche
- Email per nuove iscrizioni
- Promemoria esami
- Notifiche risultati

### 📈 Dashboard
- Endpoint per statistiche aggregate
- Report PDF automatici
- Export dati in Excel/CSV

### 🔍 Ricerca avanzata
- Ricerca studenti per filtri multipli
- Ricerca full-text
- Ordinamento personalizzato

### 🗄️ Backup automatico
- Backup giornaliero del database
- Sistema di recovery
- Log delle operazioni critiche

---

## 📝 Note

- Il frontend Angular è già configurato per ricevere il campo `matricola`
- L'interfaccia TypeScript include `matricola?: string` (opzionale)
- L'HTML in `dettaglistudente.html` mostra la matricola nel subtitle della card

---

**Data creazione:** 6 Dicembre 2025  
**Ultima modifica:** 6 Dicembre 2025
