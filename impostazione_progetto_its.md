# Guida all’Impostazione e Organizzazione del Progetto ITS  
## Caso d’Uso: Gestione Corsi ITS  

---

## 1. Fasi Principali del Lavoro

### A. Raccolta requisiti e briefing
- Leggere e analizzare insieme la traccia, annotando tutte le funzionalità richieste.
- Chiarire cosa implementare (macro-pagine, operazioni essenziali, funzioni avanzate come medie/esami “top”).
- Chiedere chiarimenti ai docenti se necessario.

### B. Scelta dello stack tecnologico
- **Frontend**: deciderlo in base alle competenze e agli interessi del gruppo (React, Angular, Vue sono le opzioni principali).
- **Backend**: Flask (Python) come probabile scelta.
- **Database**: MongoDB.
- **Prototipazione UI**: Figma per wireframe delle schermate.

### C. Prototipazione wireframe con Figma
- Creare wireframe delle schermate principali:  
  - Lista studenti  
  - Lista moduli  
  - Dettaglio studente  
  - Dettaglio modulo  
  - Pagine d’inserimento/modifica dati
- Concentrarsi sulla chiarezza delle azioni e dei flussi, non sulla grafica dettagliata.

---

## 2. Suddivisione del Progetto in Task

### A. Macro-task

1. **Progettazione dati e API**
    - Definire la struttura dei documenti MongoDB per Modulo, Studente, Esame.
    - Realizzare diagrammi dati e JSON d’esempio.
    - Stendere una prima lista di endpoint REST (CRUD per ogni entità, endpoint media e filtri).

2. **Prototipo UI con Figma**
    - Creare i wireframe delle schermate richieste.
    - Fare una revisione condivisa dal gruppo.

3. **Inizializzazione progetti**
    - Frontend: creare progetto base (React/Angular/Vue) e organizzare le cartelle.
    - Backend: inizializzare progetto Flask, connessione a MongoDB, primo “hello world”.

4. **Sviluppo CRUD base**
    - Backend: creare CRUD per Modulo/Studente/Esame (testabili con Postman).
    - Frontend: realizzare pagine base per visualizzare, inserire e modificare dati.

5. **Funzionalità avanzate**
    - Calcolo della media voti, lista esami con voto ≥24.
    - Gestione automatica delle iscrizioni (sincronizzazione studente-modulo).
    - Componenti/pulsanti specifici sul frontend.

6. **Testing e QA**
    - Test delle funzionalità sia lato backend che frontend.
    - Risoluzione bug e miglioramenti.

7. **Documentazione**
    - Aggiornamento del README, schema dati e guida d’uso.

---

### B. Micro-task (Esempi pratici)

- [ ] Bozza JSON Modulo/Studente/Esame
- [ ] Endpoint POST /studenti  
- [ ] Endpoint GET /studenti  
- [ ] Form registrazione studente (frontend)
- [ ] Visualizzazione lista studenti (frontend)
- [ ] Wireframe Dashboard (Figma)
- [ ] Funzione calcolo media voti
- [ ] Testing API con Postman
- [ ] Aggiornamento lista moduli-studente sincronizzata
- [ ] Scrittura README
- [ ] Video demo/prova orale (se richiesta)

---

## 3. Strategie di Lavoro di Gruppo

- **Usare una board condivisa** (Trello o GitHub Projects) per organizzare e visualizzare i task.
- **Dividere i ruoli** fra backend, frontend, UI design, testing/documentazione (possibile la rotazione dei ruoli).
- **Sincronizzarsi spesso**: brevi aggiornamenti periodici su chi fa cosa e ostacoli incontrati.
- **Definire struttura condivisa dei dati/API**: concordare formato JSON/schema utile a chi sviluppa frontend e backend.
- **Usare git** per versionare, meglio branch separati per ognuno.
- **Iterazione rapida**: raggiungere una prima versione funzionante e aggiungere dettagli successivamente.
- **Documentare le decisioni** (README o file extra).

---

## 4. Checklist Operativa

- [ ] Stack tecnologico scelto e ambienti installati
- [ ] JSON/schema dati deciso e condiviso
- [ ] Endpoint/API definiti e documentati
- [ ] Board dei task creata
- [ ] Ruoli assegnati (con possibilità di rotazione)
- [ ] Wireframe caricati e approvati da tutti
- [ ] Primo prototipo funzionante backend/frontend collegato
- [ ] Testing a ogni passo
- [ ] Documentazione aggiornata

---

## 5. Esempio Tabella Board per Task

| Area         | Task                        | Chi | Note      |
|--------------|-----------------------------|-----|-----------|
| Design       | Wireframe Lista Studenti    |     | Figma     |
| Frontend     | Component Lista Studenti    |     | React/Vue/Angular |
| Backend      | Endpoint GET /studenti      |     | Flask     |
| Backend      | Funzione media voti         |     | Flask     |
| Frontend     | Visualizzazione medie       |     |           |

---

**Suggerimento**:  
Personalizzate subito la board e il file README descrivendo quali strumenti userete, chi si occupa di che cosa e i primi task assegnati.

---