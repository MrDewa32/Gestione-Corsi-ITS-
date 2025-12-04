# 📘 Guida: Collegamento Backend Flask con Frontend Angular

## 🎯 Obiettivo
Collegare il backend Flask (che gestisce i dati su MongoDB) con il frontend Angular, sostituendo l'uso di `localStorage` con chiamate HTTP al server.

---

## 🔧 Modifiche Apportate

### 1️⃣ **Servizio API (`src/app/services/api.ts`)**

#### **Cosa abbiamo fatto:**
Creato un servizio centralizzato per gestire tutte le chiamate HTTP al backend Flask.

#### **Codice aggiunto:**
```typescript
export class ApiService {
  private apiUrl = 'http://127.0.0.1:5000';
  
  constructor(private http: HttpClient) {}

  // Ottieni tutti gli studenti
  getStudenti(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/studenti/`);
  }

  // Ottieni un singolo studente per ID
  getStudentiByID(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/studenti/${id}`);
  }

  // Crea un nuovo studente
  creaStudente(studente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/studenti/`, studente);
  }

  // Elimina uno studente
  eliminaStudente(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/studenti/${id}`);
  }

  // Aggiorna uno studente esistente
  aggiornaStudente(id: string, studente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/studenti/${id}`, studente);
  }
}
```

#### **Perché:**
- **Centralizzazione**: Tutti i metodi per comunicare con il backend sono in un unico posto
- **Riutilizzabilità**: Qualsiasi componente può importare `ApiService` e usare questi metodi
- **Manutenibilità**: Se cambia l'URL del backend (es. in produzione), modifichi solo `apiUrl`
- **Type Safety**: `Observable` garantisce una gestione corretta delle risposte asincrone

#### **Come funziona:**
- `this.http.get()` → invia una richiesta HTTP GET
- `this.http.post()` → invia una richiesta HTTP POST con dati nel body
- `this.http.put()` → invia una richiesta HTTP PUT per aggiornare
- `this.http.delete()` → invia una richiesta HTTP DELETE per eliminare
- **Template string** `` `${this.apiUrl}/studenti/` `` → costruisce l'URL completo

---

### 2️⃣ **Componente Elenco Studenti (`src/app/elencostudenti/elencostudenti.ts`)**

#### **Modifica 1: Import del servizio**
```typescript
import { ApiService } from '../services/api';
```
**Perché:** Per poter usare i metodi del servizio API nel componente.

---

#### **Modifica 2: Iniezione nel constructor**
```typescript
constructor(
  private dialog: MatDialog,
  private apiService: ApiService  // ← Aggiunto
) { }
```
**Perché:** Angular usa la **Dependency Injection** per fornire al componente un'istanza del servizio. Ora possiamo usare `this.apiService` in tutto il componente.

---

#### **Modifica 3: Metodo `loadStudenti()` - Prima e Dopo**

**❌ PRIMA (con localStorage):**
```typescript
loadStudenti(): void {
  const savedStudenti = localStorage.getItem('studenti');
  if (savedStudenti) {
    this.dataSource.data = JSON.parse(savedStudenti);
  } else {
    // Dati hardcoded di esempio
    const defaultStudenti = [...];
    this.dataSource.data = defaultStudenti;
  }
}
```

**✅ DOPO (con Backend):**
```typescript
loadStudenti(): void {
  this.apiService.getStudenti().subscribe({
    next: (studenti) => {
      console.log('✅ Studenti caricati dal backend:', studenti);
      this.dataSource.data = studenti;
    },
    error: (errore) => {
      console.error('❌ Errore nel caricamento studenti:', errore);
      alert('Errore nel caricamento degli studenti dal server!');
    }
  });
}
```

**Perché:**
- **Dati reali**: Ora gli studenti vengono caricati dal database MongoDB tramite Flask
- **Sincronizzazione**: Tutti gli utenti vedono gli stessi dati
- **Aggiornamenti in tempo reale**: Se un altro utente modifica i dati, al refresh li vedi
- **`.subscribe()`**: È il modo di Angular per gestire operazioni asincrone. Il codice dentro `next` viene eseguito solo quando Flask risponde
- **Gestione errori**: Se Flask è offline o c'è un problema di rete, l'utente riceve un messaggio

---

#### **Modifica 4: Metodo `rimuoviIscrizione()` - Prima e Dopo**

**❌ PRIMA (con localStorage):**
```typescript
rimuoviIscrizione(id: number): void {
  this.dataSource.data = this.dataSource.data.filter(s => s.id !== id);
  this.saveStudenti(); // Salva in localStorage
}
```

**✅ DOPO (con Backend):**
```typescript
rimuoviIscrizione(id: number): void {
  const studenteId = String(id);
  
  this.apiService.eliminaStudente(studenteId).subscribe({
    next: () => {
      console.log('✅ Studente eliminato con successo');
      this.loadStudenti(); // Ricarica la lista aggiornata
    },
    error: (errore) => {
      console.error('❌ Errore nell\'eliminazione:', errore);
      alert('Errore nell\'eliminazione dello studente!');
    }
  });
}
```

**Perché:**
- **Persistenza reale**: Lo studente viene eliminato dal database, non solo dalla memoria del browser
- **Conversione tipo**: `String(id)` converte l'ID numerico in stringa (l'API Flask si aspetta stringhe)
- **Ricaricamento**: `this.loadStudenti()` aggiorna la tabella con i dati freschi dal server
- **Feedback all'utente**: In caso di errore, l'utente viene informato

---

#### **Modifica 5: Metodo `aggiungiStudente()` - Prima e Dopo**

**❌ PRIMA (con localStorage):**
```typescript
aggiungiStudente(): void {
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const newId = Math.max(...currentData.map(s => s.id)) + 1;
      const newStudent = { id: newId, ...result };
      this.dataSource.data = [...currentData, newStudent];
      this.saveStudenti(); // Salva in localStorage
    }
  });
}
```

**✅ DOPO (con Backend):**
```typescript
aggiungiStudente(): void {
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const nuovoStudente = {
        nome: result.nome,
        cognome: result.cognome,
        email: result.email,
        corso: result.corso,
        stato: result.stato,
        visualizzato: false
      };

      this.apiService.creaStudente(nuovoStudente).subscribe({
        next: (studente) => {
          console.log('✅ Studente creato:', studente);
          this.loadStudenti(); // Ricarica la lista
        },
        error: (errore) => {
          console.error('❌ Errore nella creazione:', errore);
          alert('Errore nella creazione dello studente!');
        }
      });
    }
  });
}
```

**Perché:**
- **ID automatico**: Non serve più generare l'ID manualmente, MongoDB lo crea automaticamente (`_id`)
- **Validazione server-side**: Flask può validare i dati prima di salvarli
- **Coerenza**: I dati vengono salvati nel database centrale, non solo nel browser

---

#### **Modifica 6: Metodo `marcaVisualizzato()`**

**✅ DOPO (con Backend):**
```typescript
marcaVisualizzato(id: number): void {
  const studente = this.dataSource.data.find(s => s.id === id);
  if (studente) {
    studente.visualizzato = !studente.visualizzato;
    
    const studenteId = String(id);
    this.apiService.aggiornaStudente(studenteId, studente).subscribe({
      next: () => console.log('✅ Studente aggiornato'),
      error: (err) => console.error('❌ Errore aggiornamento:', err)
    });
  }
}
```

**Perché:**
- **Aggiornamento persistente**: Lo stato "visualizzato" viene salvato nel database
- **Chiamata PUT**: Invia tutto l'oggetto studente aggiornato al backend

---

#### **Modifica 7: Rimosso `saveStudenti()`**

**Codice rimosso:**
```typescript
saveStudenti(): void {
  localStorage.setItem('studenti', JSON.stringify(this.dataSource.data));
}
```

**Perché:**
- Non serve più salvare in `localStorage`
- I dati sono persistenti sul server (MongoDB)

---

## 🔄 Flusso di Comunicazione

### **Esempio: Caricamento Studenti**

```
1. Utente apre pagina "Elenco Studenti"
   ↓
2. Angular: ngOnInit() → loadStudenti()
   ↓
3. Angular: this.apiService.getStudenti()
   ↓
4. HTTP Request: GET http://127.0.0.1:5000/studenti/
   ↓
5. Flask: riceve richiesta, interroga MongoDB
   ↓
6. MongoDB: restituisce documenti studenti
   ↓
7. Flask: converte in JSON e risponde
   ↓
8. Angular: .subscribe({ next: (studenti) => ... })
   ↓
9. Angular: this.dataSource.data = studenti
   ↓
10. UI: tabella si aggiorna e mostra i dati
```

---

## 🆚 Confronto: localStorage vs Backend

| Aspetto | localStorage (❌ Prima) | Backend API (✅ Dopo) |
|---------|------------------------|----------------------|
| **Persistenza** | Solo nel browser | Database centrale (MongoDB) |
| **Sincronizzazione** | Dati isolati per utente | Dati condivisi tra tutti gli utenti |
| **Capacità** | Max ~5-10MB | Illimitata |
| **Sicurezza** | Accessibile da JavaScript | Protetto da autenticazione |
| **Validazione** | Solo client-side | Server-side + client-side |
| **Scalabilità** | Non scalabile | Scalabile a migliaia di utenti |

---

## 🚀 Come Testare

### **1. Avvia il Backend Flask**
```bash
cd Backend
python run.py
```
Output atteso: `Running on http://127.0.0.1:5000`

### **2. Avvia il Frontend Angular**
```bash
cd Frontend/ITS
ng serve
```
Output atteso: `Compiled successfully`

### **3. Apri il Browser**
- Vai su `http://localhost:4200`
- Apri la Console (F12)
- Naviga su "Elenco Studenti"

### **4. Verifica nella Console**
Dovresti vedere:
```
✅ Studenti caricati dal backend: [{...}, {...}]
```

### **5. Testa le Operazioni**
- **Aggiungi**: Crea un nuovo studente → verifica che appaia nella lista
- **Elimina**: Rimuovi uno studente → verifica che scompaia
- **Aggiorna**: Marca come visualizzato → verifica che lo stato cambi
- **Refresh**: Ricarica la pagina → i dati sono ancora presenti (persistenza!)

---

## 🐛 Debugging: Problemi Comuni

### **Errore: CORS**
**Sintomo:** Console mostra `CORS policy blocked`

**Soluzione:** Verifica che Flask abbia CORS abilitato:
```python
from flask_cors import CORS
CORS(app, resources={r"/*": {"origins": ["http://localhost:4200"]}})
```

### **Errore: Connection Refused**
**Sintomo:** `ERR_CONNECTION_REFUSED` nella console

**Causa:** Flask non è in esecuzione

**Soluzione:** Avvia Flask con `python run.py`

### **Errore: 404 Not Found**
**Sintomo:** Flask risponde con 404

**Causa:** URL errato nel servizio API

**Soluzione:** Verifica che l'URL corrisponda alle route Flask:
- Frontend: `http://127.0.0.1:5000/studenti/`
- Backend: `@studenti_bp.route("/", methods=["GET"])`

### **Errore: Dati non si aggiornano**
**Sintomo:** Modifiche non visibili dopo operazioni

**Causa:** Mancata chiamata a `this.loadStudenti()`

**Soluzione:** Dopo ogni operazione (create/update/delete), ricarica i dati:
```typescript
this.apiService.creaStudente(data).subscribe({
  next: () => this.loadStudenti() // ← Importante!
});
```

---

## 📚 Concetti Chiave Imparati

### **1. Observable**
È un oggetto che rappresenta una "promessa" di dati futuri. Si usa `.subscribe()` per ricevere i dati quando arrivano.

### **2. HTTP Methods**
- **GET**: Leggi dati (non modifica nulla)
- **POST**: Crea nuovi dati
- **PUT**: Aggiorna dati esistenti
- **DELETE**: Elimina dati

### **3. Dependency Injection**
Angular fornisce automaticamente un'istanza del servizio quando lo dichiari nel `constructor`.

### **4. Template Strings**
`` `${variabile}` `` permette di inserire variabili dentro stringhe.

### **5. Subscribe Pattern**
```typescript
observable.subscribe({
  next: (data) => { /* successo */ },
  error: (err) => { /* errore */ }
});
```

---

## 🎯 Prossimi Passi

1. **Aggiungere autenticazione**: Proteggere le API con token JWT
2. **Gestione errori migliorata**: Mostrare messaggi più user-friendly
3. **Loading spinners**: Indicare quando i dati sono in caricamento
4. **Validazione form**: Controllare i dati prima di inviarli
5. **Paginazione**: Gestire grandi quantità di studenti
6. **Implementare lo stesso pattern per MODULI/CORSI**

---

## ✅ Conclusione

Ora il tuo frontend Angular è completamente connesso al backend Flask! I dati sono persistenti, centralizzati e accessibili da qualsiasi client. Questo è il pattern standard per applicazioni web moderne.

**Vantaggi ottenuti:**
- ✅ Persistenza reale dei dati
- ✅ Sincronizzazione multi-utente
- ✅ Codice più manutenibile
- ✅ Scalabilità
- ✅ Separazione frontend/backend

---

📅 **Data documento:** 4 Dicembre 2025  
👤 **Autore:** GitHub Copilot  
🔧 **Progetto:** Gestione Corsi ITS
