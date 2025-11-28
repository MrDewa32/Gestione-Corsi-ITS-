# Task List Progetto "Gestione Corsi ITS"
**Stack scelto:**  
- **Frontend:** Angular  
- **Backend:** Python (Flask)  
- **Database:** MongoDB  
- **Wireframe/UI:** Figma  

---

## Macro-task principali

1. **Progettazione dati e API**
2. **Prototipazione con Figma**
3. **Setup progetti**
4. **Sviluppo Backend (CRUD & logica avanzata)**
5. **Sviluppo Frontend (CRUD & funzioni avanzate)**
6. **Testing e Integrazione**
7. **Documentazione & Demo**

---

## Task dettagliati

### 1. Progettazione dati e API
- [ ] Definire struttura collezioni (studenti, moduli, esami) in MongoDB (JSON di esempio)
- [ ] Modellare relazioni (schemi: studente-moduli, moduli-studenti, esami)
- [ ] Decidere formato dati scambiati frontend-backend
- [ ] Elenco endpoint API CRUD per:
    - [ ] Studente
    - [ ] Modulo
    - [ ] Esame
- [ ] Definire endpoint avanzati:
    - [ ] Calcolo media voti per studente
    - [ ] Lista esami con voto >=24 per studente

---

### 2. Prototipazione con Figma
- [ ] Wireframe Home/dashboard
- [ ] Wireframe pagina elenco studenti
- [ ] Wireframe pagina dettaglio studente (dati, moduli, esami, media, filtri)
- [ ] Wireframe pagina elenco moduli
- [ ] Wireframe pagina dettaglio modulo (info modulo, studenti iscritti)
- [ ] Wireframe form inserimento/modifica studente
- [ ] Wireframe form inserimento/modifica modulo
- [ ] Wireframe form inserimento/modifica esame
- [ ] Revisione collettiva wireframe

---

### 3. Setup progetti
- [ ] Inizializzare repository Git e struttura di progetto condivisa
- [ ] Setup progetto Angular (scaffolding, prime pagine a vuoto)
- [ ] Setup progetto Flask con connessione a MongoDB
- [ ] File README iniziale (stack, suddivisione lavoro)

---

### 4. Sviluppo Backend (Flask + MongoDB)
- [ ] Implementare modelli/schema per studenti, moduli, esami (PyMongo, MongoEngine o simile)
- [ ] CRUD:
    - [ ] CRUD studenti (POST, GET, PUT, DELETE)
    - [ ] CRUD moduli (POST, GET, PUT, DELETE)
    - [ ] CRUD esami (POST, GET, PUT, DELETE)
- [ ] Gestione iscrizione studente a modulo (aggiornamento automatico di entrambi, prevenzione duplicati)
- [ ] Funzione calcolo media voti per studente
- [ ] Funzione filtro esami con voto >=24 per studente
- [ ] Test endpoint base con Postman

---

### 5. Sviluppo Frontend (Angular)
- [ ] Struttura app Angular (routing, moduli, servizi)
- [ ] Servizi Angular per chiamate API verso backend per tutte le entità
- [ ] Pagina/lista studenti con visualizzazione dettagli e CRUD
- [ ] Pagina/lista moduli con dettagli e CRUD
- [ ] Pagina dettaglio studente (visualizza moduli iscritti, esami, media, filtro esami >=24)
- [ ] Pagina dettaglio modulo (studenti iscritti)
- [ ] Modali/form per inserimento e modifica dati (studente, modulo, esame)
- [ ] Visualizzazioni dati aggregati/analisi

---

### 6. Testing e Integrazione
- [ ] Testare tutte le API da frontend e backend
- [ ] Automatizzare casi di test principali (se possibile)
- [ ] Test “user testing” per i flussi primari (inserimento/modifica/ricerca)
- [ ] Fix bug e miglioramenti

---

### 7. Documentazione & Demo
- [ ] Aggiornare README (istruzioni avvio, struttura, endpoints, autori)
- [ ] Schema dati condiviso finale (magari in Markdown, o screenshot Figma)
- [ ] Eventuale video/demo se richiesto

---

## Consigli pratici
- Usare una board (Trello, GitHub Projects o simili), assegnando i task a chi se ne occupa.
- Aggiungere checklist sulle card per task complessi.
- Validare insieme i principali flussi prima di proseguire (es. per iscrizioni/modifica relazioni).
- Testare le funzioni avanzate già su dati “di esempio”.

---

Personalizzate la lista in base alle esigenze e distribuite le attività in modo equilibrato!