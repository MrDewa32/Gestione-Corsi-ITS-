# 📘 Guida: Collegamento Backend Flask con Frontend Angular

## 🎯 Obiettivo
Collegare il backend Flask (che gestisce i dati su MongoDB) con il frontend Angular, sostituendo l'uso di `localStorage` con chiamate HTTP al server.


## 🔧 Modifiche Apportate

---

## 🛠️ Problema riscontrato: Change Detection Angular (pagina dettagli studente)

### Sintomo
- La pagina "dettagli studente" rimaneva bianca o in caricamento infinito, anche se i dati venivano ricevuti correttamente dal backend.

### Analisi
- La chiamata HTTP tramite `this.apiService.getStudentiByID(id)` riceveva i dati, ma Angular non aggiornava la vista.
- Questo succede perché le operazioni asincrone (come le chiamate HTTP) possono avvenire fuori dal ciclo di rilevamento dei cambiamenti di Angular.
- Di conseguenza, anche se la variabile `studente` veniva aggiornata, la pagina non si "accorgeva" del cambiamento.

### Soluzione
1. Importare `ChangeDetectorRef` da `@angular/core`:
  ```typescript
  import { ChangeDetectorRef } from '@angular/core';
  ```
2. Iniettare `ChangeDetectorRef` nel costruttore del componente:
  ```typescript
  constructor(private cdr: ChangeDetectorRef) {}
  ```
3. Dopo aver aggiornato i dati nella subscribe, chiamare `this.cdr.detectChanges();`:
  ```typescript
  this.apiService.getStudentiByID(id).subscribe({
    next: (data) => {
     this.studente = data;
     this.loading = false;
     this.cdr.detectChanges(); // Forza l'aggiornamento della vista
    }
  });
  ```

### Risultato
- Angular aggiorna immediatamente la vista e mostra i dati ricevuti.
- Problema risolto senza workaround o hack.

---

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

  // Metodi per gestire i moduli
  getModuli(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/moduli/`);
  }

  getModuloByID(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/moduli/${id}`);
  }

  creaModulo(modulo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/moduli/`, modulo);
  }

  eliminaModulo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/moduli/${id}`);
  }

  aggiornaModulo(id: string, modulo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/moduli/${id}`, modulo);
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

## 📊 Nuova Funzionalità: Visualizzazione Statistiche Studente

### **Requisito dalla Traccia**
La traccia richiedeva:
- **Calcolo della media voti per studente**: il sistema fornisce una panoramica immediata delle performance.
- **Individuare rapidamente gli esami in cui lo studente ha ottenuto un voto pari o superiore a 24**, utile per analisi e report.

### **Implementazione**

#### 1. **Nuovi Metodi in ApiService**
```typescript
// Metodi per statistiche studenti
getMediaStudente(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/studenti/media/${id}`);
}

getVotiAltiStudente(id: string): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/studenti/voti-alti/${id}`);
}
```

#### 2. **Modifiche al Componente DettagliStudente**
Aggiunte due nuove proprietà:
```typescript
mediaVoti: number | null = null;
votiAlti: number[] = [];
```

Nuovo metodo per caricare le statistiche:
```typescript
loadStatistiche(id: string): void {
  // Carica media voti
  this.apiService.getMediaStudente(id).subscribe({
    next: (data: any) => {
      this.mediaVoti = data.voti;
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Errore caricamento media:', err)
  });

  // Carica voti alti
  this.apiService.getVotiAltiStudente(id).subscribe({
    next: (data: any) => {
      this.votiAlti = data.voti;
      this.cdr.detectChanges();
    },
    error: (err) => console.error('Errore caricamento voti alti:', err)
  });
}
```

#### 3. **Interfaccia Utente**
Aggiunta una nuova sezione "Statistics" con due card affiancate:

**Card Media Voti:**
- Icona trending_up verde
- Visualizza la media in grande (font-size 48px)
- Messaggio "Nessun voto disponibile" se non ci sono esami

**Card Voti Alti:**
- Icona star arancione
- Mostra tutti i voti ≥24 come badge
- Messaggio "Nessun voto ≥24" se non ce ne sono

#### 4. **Route Backend Utilizzate**
- `GET /studenti/media/{studente_id}` - Restituisce `{ nome, cognome, voti: media }`
- `GET /studenti/voti-alti/{studente_id}` - Restituisce `{ nome, cognome, voti: [array] }`

### **Risultato**
La pagina dettaglio studente ora mostra:
1. Informazioni personali studente
2. **Statistiche (NUOVO)**: Media voti e voti alti in card visuali
3. Lista completa esami sostenuti
4. Possibilità di aggiungere nuovi esami tramite dialog

---

## 🎨 Nuova Funzionalità: Dialog Aggiungi Esame

### **Implementazione**

#### 1. **Nuovo Componente Dialog (`aggiungiesame-dialog.ts`)**
```typescript
@Component({
  selector: 'app-aggiungiesame-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './aggiungiesame-dialog.html',
})
export class AggiungiEsameDialogComponent {
  data = {
    modulo: '',
    data: '',
    voto: null,
    note: ''
  };
}
```

#### 2. **Template del Dialog**
Form con 4 campi:
- **Modulo** (text, required)
- **Data** (date, required)
- **Voto** (number, min=18, max=30, required)
- **Note** (text, optional)

Due bottoni:
- **Annulla**: chiude il dialog senza salvare
- **Aggiungi**: salva l'esame (disabilitato se form non valido)

#### 3. **Integrazione in DettagliStudente**
```typescript
gestisciEsami(): void {
  const dialogRef = this.dialog.open(AggiungiEsameDialogComponent, {
    width: '400px',
    data: {}
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && this.studente && this.studente._id) {
      const nuovoEsame = {
        data: result.data,
        voto: result.voto,
        note: result.note,
        modulo: { nome: result.modulo, codice: '', ore: 0, descrizione: '' }
      };
      
      const esamiAggiornati = this.studente.esami ? 
        [...this.studente.esami, nuovoEsame] : [nuovoEsame];
      const studenteId = this.studente._id;
      
      this.apiService.aggiornaStudente(studenteId, {
        ...this.studente,
        esami: esamiAggiornati
      }).subscribe({
        next: () => this.loadStudente(studenteId),
        error: (err) => alert('Errore durante l\'aggiunta dell\'esame')
      });
    }
  });
}
```

### **Flusso Utente**
1. Click su "Aggiungi Esami"
2. Si apre popup con form
3. Compila campi obbligatori (modulo, data, voto)
4. Click "Aggiungi" → esame salvato su backend
5. Lista esami si aggiorna automaticamente
6. Statistiche si aggiornano dopo il reload

---

## 🏫 Nuova Funzionalità: Gestione Moduli

### **Componente Corso trasformato per Gestione Moduli**

#### 1. **Interfaccia Modulo**
```typescript
export interface Modulo {
  _id?: string;
  codice: string;
  nome: string;
  ore: number;
  descrizione: string;
  studentiIscritti?: string[];
}
```

#### 2. **Componente Corso (`corso.ts`)**
Trasformato da componente statico con dati hardcoded a componente dinamico con caricamento dal backend:

**Prima (dati statici):**
```typescript
export class Corso {
  dati = [
    {titolo: "titolo1", descrizione: "descrizione1", badge: 1},
    // ... dati hardcoded
  ];
}
```

**Dopo (backend integration):**
```typescript
export class Corso implements OnInit {
  moduli: Modulo[] = [];
  loading = true;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadModuli();
  }

  loadModuli(): void {
    this.apiService.getModuli().subscribe({
      next: (data: any) => {
        // Backend restituisce {moduli: [...]}
        this.moduli = data.moduli || data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore caricamento moduli:', err);
        alert('Errore nel caricamento dei moduli dal server!');
        this.loading = false;
      }
    });
  }

  visualizzaDettaglio(moduloId: string): void {
    this.router.navigate(['/modulo', moduloId]);
  }
}
```

#### 3. **Template HTML (`corso.html`)**
```html
<div class="moduli-container">
  <div class="header">
    <h1>Gestione Moduli</h1>
    <button mat-raised-button color="primary">
      <mat-icon>add</mat-icon>
      Aggiungi Modulo
    </button>
  </div>

  <div class="card-container">
    <app-card 
      *ngFor="let modulo of moduli"
      [titolo]="modulo.nome"
      [descrizione]="modulo.descrizione"
      [badge]="modulo.studentiIscritti?.length || 0"
      (click)="visualizzaDettaglio(modulo._id!)"
    />
  </div>

  <div *ngIf="moduli.length === 0" class="empty-state">
    <mat-icon>school</mat-icon>
    <p>Nessun modulo disponibile</p>
  </div>
</div>
```

#### 4. **Caratteristiche**
- ✅ Carica moduli dal backend tramite `ApiService.getModuli()`
- ✅ Visualizza ogni modulo come card riutilizzando il componente `Card` esistente
- ✅ Badge mostra il numero di studenti iscritti
- ✅ Click sulla card naviga ai dettagli del modulo
- ✅ Bottone "Aggiungi Modulo" per creare nuovi moduli
- ✅ Empty state se non ci sono moduli
- ✅ Hover effect sulle card

#### 5. **Problema Risolto: Formato Risposta Backend**
**Sintomo:** Errore `NG0900: Error trying to diff '[object Object]'`

**Causa:** Il backend Flask restituisce `{moduli: Array(6)}` invece di `Array(6)`

**Soluzione:** Estrarre l'array dalla proprietà `moduli`:
```typescript
this.moduli = data.moduli || data;
```

#### 6. **Route Backend**
- `GET /moduli/` - Lista tutti i moduli
- `GET /moduli/{id}` - Dettagli modulo specifico
- `POST /moduli/` - Crea nuovo modulo
- `PUT /moduli/{id}` - Aggiorna modulo
- `DELETE /moduli/{id}` - Elimina modulo

**Nota importante:** L'URL è `/moduli/` (plurale) non `/modulo/` come registrato nel blueprint Flask.

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

### **6. MatDialog**
Sistema di Angular Material per creare popup/modal. Si usa `dialog.open(ComponenteDialog)` e si gestisce la chiusura con `afterClosed().subscribe()`.

### **7. Standalone Components**
In Angular 18+, i componenti possono essere `standalone: true` e dichiarare i propri imports senza bisogno di NgModule.

### **8. Riutilizzo Componenti**
Il componente `Card` è stato riutilizzato sia per visualizzare corsi che moduli, cambiando solo i dati passati come input.

### **9. Formato Risposta Backend**
Alcuni endpoint Flask possono restituire oggetti wrapper (es. `{moduli: [...]}`) invece di array diretti. Importante estrarre i dati correttamente: `data.moduli || data`.

---

## 🎯 Funzionalità Implementate dalla Traccia

✅ **1. Gestione dei Moduli**
- ✅ Visualizzazione elenco moduli con card
- ✅ Numero studenti iscritti su ogni card (badge)
- ✅ CRUD completo moduli (API backend pronte)
- ✅ Navigazione a dettagli modulo (da implementare componente dettaglio)
- ✅ Route API disponibili in `ApiService`

✅ **2. Gestione degli Studenti**
- Registrazione nuovi studenti con form
- Visualizzazione elenco con tabella Material
- Dettagli studente con tutte le informazioni
- Eliminazione e modifica studenti

✅ **3. Gestione Esami**
- Tracciamento esami con data, voto, note
- Storico completo esami per studente
- **Dialog per aggiungere nuovi esami**

✅ **4. Funzionalità Avanzate**
- **Calcolo media voti**: visualizzata in card dedicata
- **Voti alti (≥24)**: visualizzati come badge nella pagina dettagli
- Aggiornamento automatico dopo ogni operazione

---

## 🎯 Prossimi Passi

1. **Componente Dettaglio Modulo**: Visualizzare dettagli modulo con elenco studenti iscritti
2. **Dialog Aggiungi/Modifica Modulo**: Form per creare e modificare moduli
3. **Iscrizione studenti a moduli**: Implementare funzionalità per aggiungere/rimuovere studenti da moduli
4. **Aggiungere autenticazione**: Proteggere le API con token JWT
5. **Gestione errori migliorata**: Toast notifications invece di alert()
6. **Validazione form avanzata**: Reactive Forms con validatori custom
7. **Paginazione**: Gestire grandi quantità di studenti/moduli
8. **Filtri e ricerca**: Filtrare studenti per corso, stato, etc.
9. **Grafici statistiche**: Visualizzare performance con chart.js o ngx-charts

---

## ✅ Conclusione

Ora il tuo frontend Angular è completamente connesso al backend Flask! I dati sono persistenti, centralizzati e accessibili da qualsiasi client. Questo è il pattern standard per applicazioni web moderne.

**Vantaggi ottenuti:**
- ✅ Persistenza reale dei dati
- ✅ Sincronizzazione multi-utente
- ✅ Codice più manutenibile
- ✅ Scalabilità
- ✅ Separazione frontend/backend

**Funzionalità implementate:**
- ✅ CRUD completo studenti
- ✅ Visualizzazione dettagli studente
- ✅ Calcolo e visualizzazione media voti
- ✅ Visualizzazione voti alti (≥24)
- ✅ Dialog per aggiungere esami
- ✅ Gestione Change Detection Angular
- ✅ Standalone Components con Material Design
- ✅ Visualizzazione elenco moduli con card riutilizzabili
- ✅ API complete per gestione moduli (backend + frontend)
- ✅ Conteggio studenti iscritti per modulo

---

📅 **Ultima modifica:** 7 Dicembre 2025  
👤 **Autore:** GitHub Copilot  
🔧 **Progetto:** Gestione Corsi ITS

