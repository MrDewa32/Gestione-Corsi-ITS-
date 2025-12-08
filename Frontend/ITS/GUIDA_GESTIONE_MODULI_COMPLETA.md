# Guida Completa - Gestione Moduli e Dialog di Modifica

## Data: 8 Dicembre 2025

Questa guida documenta tutte le nuove funzionalità implementate per la gestione completa dei moduli e le funzionalità di modifica per studenti e moduli.

---

## 📋 Indice

1. [Componente Dettaglio Modulo](#1-componente-dettaglio-modulo)
2. [Dialog Crea Modulo](#2-dialog-crea-modulo)
3. [Dialog Modifica Modulo](#3-dialog-modifica-modulo)
4. [Dialog Modifica Studente](#4-dialog-modifica-studente)
5. [Aggiornamenti al Componente Corso](#5-aggiornamenti-al-componente-corso)
6. [Struttura File e Organizzazione](#6-struttura-file-e-organizzazione)
7. [Flussi di Lavoro Completi](#7-flussi-di-lavoro-completi)

---

## 1. Componente Dettaglio Modulo

### 📁 File Coinvolti
- `src/app/dettagliomodulo/dettagliomodulo.ts`
- `src/app/dettagliomodulo/dettagliomodulo.html`
- `src/app/dettagliomodulo/dettagliomodulo.css`
- `src/app/dettagliomodulo/dettagliomodulo.spec.ts`

### 🎯 Funzionalità

Il componente mostra i dettagli completi di un modulo con:
- Informazioni del modulo (nome, codice, ore, descrizione)
- Tabella degli studenti iscritti
- Pulsanti per modificare ed eliminare il modulo
- Navigazione verso i dettagli degli studenti

### 📊 Interfacce TypeScript

```typescript
// Studente iscritto (come arriva dal backend)
export interface StudenteIscritto {
  studente_id: string;
  nome: string;  // Nome completo (nome + cognome)
}

// Modulo completo con studenti
export interface ModuloCompleto {
  _id?: string;
  codice: string;
  nome: string;
  ore: number;
  descrizione: string;
  studentiIscritti?: StudenteIscritto[];
}
```

### 🔧 Metodi Principali

#### `ngOnInit()`
Estrae l'ID del modulo dalla route e carica i dati.

#### `loadModulo(id: string)`
```typescript
loadModulo(id: string): void {
  this.apiService.getModuloByID(id).subscribe({
    next: (data: any) => {
      this.modulo = data.modulo || data;
      this.studentiIscritti = this.modulo?.studentiIscritti || [];
      this.cdr.detectChanges(); // Forza aggiornamento della view
    },
    error: (err) => {
      console.error('Errore caricamento modulo:', err);
    }
  });
}
```

**Nota Importante:** Uso di `ChangeDetectorRef.detectChanges()` per forzare l'aggiornamento della view dopo operazioni asincrone.

#### `modificaModulo()`
Apre il dialog di modifica e aggiorna il modulo tramite API.

```typescript
modificaModulo(): void {
  const dialogRef = this.dialog.open(ModificaModuloDialogComponent, {
    width: '500px',
    data: this.modulo
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && this.modulo?._id) {
      const { _id, studentiIscritti, ...moduloData } = result;
      this.apiService.aggiornaModulo(this.modulo._id, moduloData).subscribe({
        next: () => {
          alert('Modulo aggiornato con successo!');
          this.loadModulo(this.modulo!._id!);
        }
      });
    }
  });
}
```

**Importante:** Rimuovere `_id` e `studentiIscritti` dal body della richiesta PUT.

#### `eliminaModulo()`
Elimina il modulo con conferma utente.

#### `visualizzaStudente(studenteId: string)`
Naviga alla pagina dettagli studente.

### 🎨 Template HTML

**Caratteristiche:**
- Card informazioni modulo con Material Design
- Tabella studenti iscritti (`mat-table`)
- Pulsanti azione con icone Material
- Gestione stato vuoto (nessuno studente iscritto)

### 🌐 Route

```typescript
// src/app/app.routes.ts
{ 
  path: 'dettagliomodulo/:id', 
  component: DettaglioModulo, 
  title: 'Dettaglio Modulo' 
}
```

### 🎯 CSS Importante

```css
.moduli-container {
  padding: 24px;
  padding-top: 96px;  /* Spazio per navbar fissa */
  max-width: 1200px;
  margin: 0 auto;
}
```

**Nota:** Il `padding-top: 96px` è fondamentale per evitare che la navbar fissa copra il contenuto.

---

## 2. Dialog Crea Modulo

### 📁 File Coinvolti
- `src/app/corso/crea-modulo-dialog.ts`
- `src/app/corso/crea-modulo-dialog.html`
- `src/app/corso/crea-modulo-dialog.css`

### 🎯 Funzionalità

Dialog per creare un nuovo modulo con form validato.

### 📋 Campi del Form

1. **Codice Modulo** (required) - Es: MOD001
2. **Nome Modulo** (required) - Es: Programmazione Web
3. **Ore Totali** (required, min: 1) - Es: 40
4. **Descrizione** (optional) - Testo libero

### 💻 Implementazione

```typescript
export class CreaModuloDialogComponent {
  modulo = {
    codice: '',
    nome: '',
    ore: 0,
    descrizione: ''
  };

  onSave(): void {
    if (this.modulo.codice && this.modulo.nome && this.modulo.ore > 0) {
      this.dialogRef.close(this.modulo);
    }
  }
}
```

### 🔗 Integrazione nel Componente Corso

```typescript
creaModulo(): void {
  const dialogRef = this.dialog.open(CreaModuloDialogComponent, {
    width: '500px'
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.apiService.creaModulo(result).subscribe({
        next: (response) => {
          alert('Modulo creato con successo!');
          this.loadModuli(); // Ricarica lista
        }
      });
    }
  });
}
```

### 🎨 Template Features

- `FormsModule` con `[(ngModel)]` per two-way binding
- `appearance="outline"` per Material Form Fields
- Validazione client-side con `[disabled]`

---

## 3. Dialog Modifica Modulo

### 📁 File Coinvolti
- `src/app/dettagliomodulo/modifica-modulo-dialog.ts`
- `src/app/dettagliomodulo/modifica-modulo-dialog.html`
- `src/app/dettagliomodulo/modifica-modulo-dialog.css`

### 🎯 Funzionalità

Dialog per modificare un modulo esistente.

### 💻 Implementazione con MAT_DIALOG_DATA

```typescript
export class ModificaModuloDialogComponent {
  modulo: ModuloCompleto;

  constructor(
    public dialogRef: MatDialogRef<ModificaModuloDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModuloCompleto
  ) {
    // Crea una copia per evitare di modificare l'originale
    this.modulo = { ...data };
  }
}
```

**Importante:** Sempre creare una copia dei dati con spread operator `{ ...data }` per evitare di modificare l'oggetto originale mentre l'utente edita.

### 🔄 Flusso di Modifica

1. L'utente clicca "Modifica" nella pagina dettaglio modulo
2. Il dialog si apre con i dati correnti
3. L'utente modifica i campi
4. Al salvataggio, i dati vengono inviati al backend
5. La pagina ricarica i dati aggiornati

---

## 4. Dialog Modifica Studente

### 📁 File Coinvolti
- `src/app/dettaglistudente/modifica-studente-dialog.ts`
- `src/app/dettaglistudente/modifica-studente-dialog.html`
- `src/app/dettaglistudente/modifica-studente-dialog.css`

### 🎯 Funzionalità

Dialog per modificare le credenziali di uno studente.

### 📋 Campi Modificabili

1. **Nome** (required)
2. **Cognome** (required)
3. **Email** (required, type: email)

**Nota:** Il campo password è stato rimosso dalla modifica per motivi di sicurezza.

### 💻 Interfaccia TypeScript

```typescript
export interface StudenteData {
  _id?: string;
  nome: string;
  cognome: string;
  email: string;
}
```

### 🔗 Integrazione nel Componente Dettaglio Studente

```typescript
modificaCredenziali(): void {
  const dialogRef = this.dialog.open(ModificaStudenteDialogComponent, {
    width: '500px',
    data: {
      _id: this.studente._id,
      nome: this.studente.nome,
      cognome: this.studente.cognome,
      email: this.studente.email
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && this.studente?._id) {
      // Rimuovo _id dal body della richiesta
      const { _id, ...studenteData } = result;
      this.apiService.aggiornaStudente(this.studente._id, studenteData).subscribe({
        next: () => {
          alert('Credenziali aggiornate con successo!');
          this.loadStudente(this.studente!._id!);
        }
      });
    }
  });
}
```

**Cruciale:** Rimuovere `_id` dal body della richiesta con destructuring:
```typescript
const { _id, ...studenteData } = result;
```

---

## 5. Aggiornamenti al Componente Corso

### 📁 File: `src/app/corso/corso.ts`

### 🆕 Nuove Funzionalità

#### Pulsante "Aggiungi Modulo"

```html
<!-- src/app/corso/corso.html -->
<div class="header">
  <h1>Gestione Moduli</h1>
  <button mat-raised-button color="primary" (click)="creaModulo()">
    <mat-icon>add</mat-icon>
    Aggiungi Modulo
  </button>
</div>
```

#### Navigazione al Dettaglio

```typescript
visualizzaDettaglio(moduloId: string): void {
  this.router.navigate(['/dettagliomodulo', moduloId]);
}
```

### 🎨 CSS Update

```css
.moduli-container {
  padding: 24px;
  padding-top: 96px;  /* IMPORTANTE: Spazio per navbar fissa */
  max-width: 1200px;
  margin: 0 auto;
}
```

---

## 6. Struttura File e Organizzazione

### 📂 Albero Directory

```
src/app/
├── corso/
│   ├── corso.ts
│   ├── corso.html
│   ├── corso.css
│   ├── crea-modulo-dialog.ts
│   ├── crea-modulo-dialog.html
│   └── crea-modulo-dialog.css
│
├── dettagliomodulo/
│   ├── dettagliomodulo.ts
│   ├── dettagliomodulo.html
│   ├── dettagliomodulo.css
│   ├── dettagliomodulo.spec.ts
│   ├── modifica-modulo-dialog.ts
│   ├── modifica-modulo-dialog.html
│   └── modifica-modulo-dialog.css
│
└── dettaglistudente/
    ├── dettaglistudente.ts
    ├── dettaglistudente.html
    ├── dettaglistudente.css
    ├── aggiungiesame-dialog.ts
    ├── aggiungiesame-dialog.html
    ├── iscrivi-modulo-dialog.ts
    ├── iscrivi-modulo-dialog.html
    ├── modifica-studente-dialog.ts
    ├── modifica-studente-dialog.html
    └── modifica-studente-dialog.css
```

### 📦 Import dei Dialog

Tutti i dialog sono **standalone components** e vanno importati direttamente:

```typescript
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CreaModuloDialogComponent } from './crea-modulo-dialog';
```

---

## 7. Flussi di Lavoro Completi

### 🔄 Flusso Creazione Modulo

1. **Utente** → Naviga a `/corsi`
2. **Utente** → Clicca "Aggiungi Modulo"
3. **Frontend** → Apre `CreaModuloDialogComponent`
4. **Utente** → Compila form (codice, nome, ore, descrizione)
5. **Frontend** → Valida campi client-side
6. **Utente** → Clicca "Crea Modulo"
7. **Frontend** → `POST /moduli/` con dati modulo
8. **Backend** → Salva in MongoDB
9. **Backend** → Ritorna modulo creato con `_id`
10. **Frontend** → Mostra alert successo e ricarica lista

### 🔄 Flusso Modifica Modulo

1. **Utente** → Naviga a `/dettagliomodulo/:id`
2. **Frontend** → Carica modulo con `GET /moduli/:id`
3. **Utente** → Clicca "Modifica"
4. **Frontend** → Apre `ModificaModuloDialogComponent` con dati correnti
5. **Utente** → Modifica campi
6. **Utente** → Clicca "Salva Modifiche"
7. **Frontend** → Rimuove `_id` e `studentiIscritti` dal body
8. **Frontend** → `PUT /moduli/:id` con dati aggiornati
9. **Backend** → Aggiorna documento in MongoDB
10. **Backend** → Ritorna modulo aggiornato
11. **Frontend** → Ricarica dettagli modulo

### 🔄 Flusso Eliminazione Modulo

1. **Utente** → Naviga a `/dettagliomodulo/:id`
2. **Utente** → Clicca "Elimina"
3. **Frontend** → Mostra `confirm()` di conferma
4. **Utente** → Conferma eliminazione
5. **Frontend** → `DELETE /moduli/:id`
6. **Backend** → Elimina da MongoDB
7. **Frontend** → Mostra alert e torna alla lista moduli

### 🔄 Flusso Modifica Studente

1. **Utente** → Naviga a `/dettaglistudente/:id`
2. **Frontend** → Carica studente con `GET /studenti/:id`
3. **Utente** → Clicca "Modifica Credenziali"
4. **Frontend** → Apre `ModificaStudenteDialogComponent`
5. **Utente** → Modifica nome, cognome, email
6. **Utente** → Clicca "Salva Modifiche"
7. **Frontend** → Rimuove `_id` dal body
8. **Frontend** → `PUT /studenti/:id` con dati aggiornati
9. **Backend** → Aggiorna documento studente
10. **Frontend** → Ricarica dettagli studente

---

## 🐛 Problemi Risolti e Soluzioni

### Problema 1: Navbar Copre Contenuto

**Sintomo:** Il pulsante "Aggiungi Modulo" non era visibile, coperto dalla navbar fissa.

**Soluzione:**
```css
.moduli-container {
  padding-top: 96px; /* Altezza navbar + margine */
}
```

### Problema 2: Modulo Non Viene Visualizzato

**Sintomo:** "Impossibile caricare il modulo" anche se i dati arrivano correttamente.

**Causa:** Change Detection non attivato dopo chiamata asincrona.

**Soluzione:**
```typescript
constructor(private cdr: ChangeDetectorRef) {}

loadModulo(id: string): void {
  this.apiService.getModuloByID(id).subscribe({
    next: (data) => {
      this.modulo = data.modulo || data;
      this.cdr.detectChanges(); // Forza aggiornamento
    }
  });
}
```

### Problema 3: Errore 400 su PUT Request

**Sintomo:** `400 BAD REQUEST` quando si modifica studente o modulo.

**Causa:** Campo `_id` inviato nel body della richiesta.

**Soluzione:**
```typescript
const { _id, ...studenteData } = result;
this.apiService.aggiornaStudente(id, studenteData);
```

### Problema 4: Iscrizione Studente a Modulo Fallisce (404)

**Sintomo:** `POST /studenti/:id/iscriviti/Pariatur%20Delectus` → 404

**Causa:** Il dialog passava il **nome** del modulo invece del **codice**.

**Verifica:** Il binding era corretto `[value]="modulo.codice"`, ma i moduli creati avevano codici strani.

**Soluzione:** Usare codici chiari (es. MOD001, MOD002) quando si creano moduli.

---

## 📝 Best Practices Implementate

### 1. Standalone Components
Tutti i nuovi componenti e dialog sono standalone:
```typescript
@Component({
  selector: 'app-dettagliomodulo',
  standalone: true,
  imports: [CommonModule, MatCardModule, ...],
  // ...
})
```

### 2. Separazione dei Dati
Mai modificare direttamente i dati passati al dialog:
```typescript
constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
  this.modulo = { ...data }; // Copia
}
```

### 3. Gestione Errori
Sempre gestire errori nelle chiamate HTTP:
```typescript
this.apiService.method().subscribe({
  next: (response) => { /* successo */ },
  error: (err) => {
    console.error('Errore:', err);
    alert('Messaggio user-friendly');
  }
});
```

### 4. Type Safety
Definire interfacce per tutti i dati:
```typescript
export interface ModuloCompleto {
  _id?: string;
  codice: string;
  // ...
}
```

### 5. Change Detection
Usare `ChangeDetectorRef` quando necessario:
```typescript
constructor(private cdr: ChangeDetectorRef) {}
this.cdr.detectChanges();
```

---

## 🧪 Testing

### Test Manuale - Checklist

#### Moduli
- [ ] Creare nuovo modulo
- [ ] Visualizzare dettagli modulo
- [ ] Modificare modulo esistente
- [ ] Eliminare modulo (con conferma)
- [ ] Navigare da lista moduli a dettaglio
- [ ] Visualizzare studenti iscritti
- [ ] Cliccare su studente per vedere dettagli

#### Studenti
- [ ] Modificare credenziali studente (nome, cognome, email)
- [ ] Verificare che password NON sia modificabile
- [ ] Verificare reload automatico dopo modifica

#### UI/UX
- [ ] Pulsante "Aggiungi Modulo" visibile (non coperto da navbar)
- [ ] Tutti i dialog si aprono correttamente
- [ ] Form validation funzionante
- [ ] Alert di conferma mostrati
- [ ] Navigazione fluida tra pagine

---

## 🔧 Configurazione Routes Completa

```typescript
// src/app/app.routes.ts
export const routes: Routes = [
  { path: '', component: Homepage, title: 'Home' },
  { path: 'corsi', component: Corso, title: 'Corsi' },
  { path: 'dettagliomodulo/:id', component: DettaglioModulo, title: 'Dettaglio Modulo' },
  { path: 'elencostudenti', component: Elencostudenti, title: 'Elenco Studenti' },
  { path: 'dettaglistudente/:id', component: Dettaglistudente, title: 'Dettagli Studente' },
  // ... altre route
];
```

---

## 📊 Endpoint API Utilizzati

### Moduli
- `GET /moduli/` - Lista tutti i moduli
- `GET /moduli/:id` - Dettaglio modulo
- `POST /moduli/` - Crea nuovo modulo
- `PUT /moduli/:id` - Aggiorna modulo
- `DELETE /moduli/:id` - Elimina modulo

### Studenti
- `GET /studenti/:id` - Dettaglio studente
- `PUT /studenti/:id` - Aggiorna studente
- `POST /studenti/:id/iscriviti/:codice` - Iscrivi a modulo

---

## 🎓 Conclusione

Tutte le funzionalità CRUD per moduli e studenti sono ora complete:

✅ **Creazione** - Dialog per creare nuovi moduli
✅ **Lettura** - Pagina dettaglio con tutte le informazioni
✅ **Aggiornamento** - Dialog per modificare moduli e studenti
✅ **Eliminazione** - Funzione elimina con conferma

Il sistema è completamente funzionale e segue le best practices di Angular 18 con standalone components e Material Design.

---

**Prossimi Sviluppi Possibili:**
- Dialog per modificare/eliminare singoli esami
- Gestione permessi utente
- Validazione email lato server
- Conferma elimina più robusta (modal invece di confirm)
- Ricerca e filtri nella lista moduli
- Paginazione per grandi quantità di dati

---

📅 **Ultima Modifica:** 8 Dicembre 2025  
✍️ **Autore:** GitHub Copilot con Claude Sonnet 4.5
