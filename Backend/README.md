# Backend - Gestione Corsi ITS

Sistema di gestione per corsi ITS sviluppato con Flask e MongoDB.

## Descrizione

Applicazione backend per la gestione di studenti, moduli ed esami di un istituto tecnico superiore (ITS). Il sistema permette di:
- Gestire studenti con dati personali e storico esami
- Gestire moduli formativi con informazioni dettagliate
- Tracciare iscrizioni e performance degli studenti
- Conservare snapshot dei moduli al momento degli esami per storicizzazione

## Tecnologie utilizzate

- **Flask** - Framework web Python
- **MongoDB** - Database NoSQL
- **MongoEngine** - ODM (Object Document Mapper) per MongoDB
- **Python 3.x** - Linguaggio di programmazione

## Struttura del progetto

```
Backend/
├── app/
│   ├── __init__.py           # Inizializzazione app Flask e connessione MongoDB
│   ├── config.py             # Configurazione database e applicazione
│   ├── models/
│   │   ├── __init__.py       # Esportazione modelli
│   │   ├── studente.py       # Modello Studente e EsameEmbedded
│   │   └── modulo.py         # Modello Modulo, ModuloSnapshot, StudenteSubset
│   ├── routes/
│   │   ├── __init__.py       # Esportazione blueprint
│   │   └── studenti.py       # Route CRUD per studenti
│   ├── services/             # Logica di business (futuri servizi)
│   └── utils/
│       ├── config.py         # Configurazioni
│       └── genera_dati.py    # Script popolamento database
├── dati default/
│   ├── studenti_Version3.json
│   └── moduli_Version3.json
├── requirements.txt          # Dipendenze Python
├── run.py                    # Punto di ingresso applicazione
└── README.md                 # Questo file

```

## Modelli dati

### Studente
- Nome, cognome, email
- Lista moduli iscritti (codici modulo)
- Lista esami sostenuti (embedded con snapshot modulo)

### Modulo
- Codice univoco, nome, ore, descrizione
- Lista studenti iscritti (subset con id e nome)

### EsameEmbedded
- Data, voto, note
- ModuloSnapshot (snapshot del modulo al momento dell'esame)

## Installazione

1. Clona il repository:
```bash
git clone <url-repository>
cd Backend
```

2. Crea e attiva un ambiente virtuale:
```bash
python -m venv .env
.env\Scripts\activate  # Windows
```

3. Installa le dipendenze:
```bash
pip install -r requirements.txt
```

4. Assicurati che MongoDB sia in esecuzione localmente sulla porta 27017.

## Configurazione

La configurazione è in `app/config.py`:
```python
class Config:
    DEBUG = True
    MONGODB_SETTINGS = {
        "db": "Gestione-Corsi-ITS",
        "host": "localhost",
        "port": 27017
    }
```

## Avvio applicazione

```bash
python run.py
```

L'applicazione sarà disponibile su `http://127.0.0.1:5000`

## Popolamento database

Per popolare il database con dati di esempio:
```bash
python -m app.utils.genera_dati
```

## API Endpoints

### Studenti

- `GET /studenti/` - Lista tutti gli studenti
- `POST /studenti/` - Crea un nuovo studente
- `GET /studenti/<id>` - Dettaglio studente specifico
- `PUT /studenti/<id>` - Aggiorna studente
- `DELETE /studenti/<id>` - Elimina studente

### Esempio richiesta POST

```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario.rossi@email.com",
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
        "descrizione": "Modulo base"
      }
    }
  ]
}
```

## Testing

Usa Postman o curl per testare gli endpoint:

```bash
# Lista studenti
curl http://127.0.0.1:5000/studenti/

# Dettaglio studente
curl http://127.0.0.1:5000/studenti/<id>
```

## Documentazione aggiuntiva

- `documentazione_rotte_studenti.md` - Documentazione dettagliata delle route studenti

## Sviluppi futuri

- [ ] Route CRUD per moduli
- [ ] Iscrizione automatica studente a modulo
- [ ] Calcolo media voti studente
- [ ] Filtro esami con voto >= 24
- [ ] Autenticazione e autorizzazione
- [ ] Validazione avanzata input

## Licenza

[Specificare licenza]

## Autori

[Specificare autori]
