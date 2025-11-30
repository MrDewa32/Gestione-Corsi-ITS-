import json
from mongoengine import connect
from app.models import Studente, EsameEmbedded, ModuloSnapshot, Modulo, StudenteSubset

# Configura la connessione (modifica se necessario)
connect(db="Gestione-Corsi-ITS", host="localhost", port=27017)

# Percorsi ai file JSON
dir_base = "dati default/"
file_studenti = dir_base + "studenti_Version3.json"
file_moduli = dir_base + "moduli_Version3.json"

# Carica i moduli
with open(file_moduli, encoding="utf-8") as f:
    moduli_data = json.load(f)

Modulo.drop_collection()
for m in moduli_data:
    studenti_embedded = [
        StudenteSubset(nome=s["nome"], studente_id=None)
        for s in m.get("studentiIscritti", [])
    ]
    modulo = Modulo(
        codice=m["codice"],
        nome=m["nome"],
        ore=m["ore"],
        descrizione=m["descrizione"],
        studentiIscritti=studenti_embedded,
    )
    modulo.save()

# Carica gli studenti
with open(file_studenti, encoding="utf-8") as f:
    studenti_data = json.load(f)

Studente.drop_collection()
for s in studenti_data:
    esami = []
    for esame in s.get("esami", []):
        modulo_snapshot = ModuloSnapshot(**esame["modulo"])
        esami.append(
            EsameEmbedded(
                data=esame["data"],
                voto=esame["voto"],
                note=esame["note"],
                modulo=modulo_snapshot,
            )
        )
    studente = Studente(
        nome=s["nome"],
        cognome=s["cognome"],
        email=s["email"],
        moduliIscritti=s["moduliIscritti"],
        esami=esami,
    )
    studente.save()

print("Dati caricati con successo!")
