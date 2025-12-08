# 📘 Guida: Iscrizione Studente a Modulo

## 🎯 Obiettivo
Permettere l'iscrizione di uno studente a un modulo direttamente dalla pagina di dettaglio studente, con aggiornamento bidirezionale sia dello studente che del modulo.

---

## 🔧 Implementazione

### 1️⃣ **Route Backend (`studenti.py`)**

#### **Endpoint di Iscrizione**
```python
@studenti_bp.route(
    "/<string:studente_id>/iscriviti/<string:codice_modulo>", methods=["POST"]
)
def iscriviti_modulo(studente_id, codice_modulo):
    """Iscrivi studente a modulo - aggiornamento bidirezionale"""
```

#### **Funzionalità:**
1. Valida che studente e modulo esistano
2. Verifica che lo studente non sia già iscritto
3. Aggiunge il codice modulo all'array `moduliIscritti` dello studente
4. Aggiunge i dati dello studente all'array `studentiIscritti` del modulo

#### **Request:**
```
POST /studenti/{studente_id}/iscriviti/{codice_modulo}
Body: {} (vuoto)
```

#### **Response Success (201):**
```json
{
  "message": "Iscrizione completata con successo",
  "studente": {
    "id": "507f1f77bcf86cd799439011",
    "nome": "Mario",
    "cognome": "Rossi"
  },
  "modulo": {
    "codice": "ITS101",
    "nome": "Programmazione Web"
  }
}
```

#### **Aggiornamento Bidirezionale:**
**Studente:**
```python
db.studente.update_one(
    {"_id": oid_studente},
    {"$addToSet": {"moduliIscritti": codice_modulo}}
)
```

**Modulo:**
```python
db.modulo.update_one(
    {"codice": codice_modulo},
    {
        "$addToSet": {
            "studentiIscritti": {
                "studente_id": studente_id,
                "nome": studente.get("nome", ""),
                "cognome": studente.get("cognome", "")
            }
        }
    }
)
```

---

### 2️⃣ **Servizio API Frontend (`api.ts`)**

#### **Nuovo Metodo**
```typescript
// Iscrivi studente a modulo
iscriviStudenteModulo(studenteId: string, codiceModulo: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/studenti/${studenteId}/iscriviti/${codiceModulo}`, {});
}
```

#### **Perché:**
- Centralizza la chiamata API per l'iscrizione
- Body vuoto `{}` perché tutti i dati necessari sono nell'URL
- Restituisce un Observable per gestione asincrona

---

### 3️⃣ **Componente Dialog (`iscrivi-modulo-dialog.ts`)**

#### **Interfaccia**
```typescript
export class IscriviModuloDialogComponent implements OnInit {
  moduli: Modulo[] = [];
  codiceModuloSelezionato: string = '';
  loading = false;

  constructor(
    private dialogRef: MatDialogRef<IscriviModuloDialogComponent>,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.loadModuli();
  }
}
```

#### **Caricamento Moduli**
```typescript
loadModuli(): void {
  this.apiService.getModuli().subscribe({
    next: (data: any) => {
      this.moduli = data.moduli || data;
    },
    error: (err) => {
      console.error('Errore caricamento moduli:', err);
      alert('Errore nel caricamento dei moduli');
    }
  });
}
```

#### **Conferma Iscrizione**
```typescript
conferma(): void {
  if (this.codiceModuloSelezionato) {
    this.dialogRef.close(this.codiceModuloSelezionato);
  }
}
```

**Nota:** Il dialog restituisce solo il codice modulo selezionato. La logica di iscrizione è gestita dal componente padre.

---

### 4️⃣ **Template Dialog (`iscrivi-modulo-dialog.html`)**

```html
<h2 mat-dialog-title>Iscrivi a Modulo</h2>
<mat-dialog-content>
  <mat-form-field appearance="fill" style="width: 100%;">
    <mat-label>Seleziona Modulo</mat-label>
    <mat-select [(ngModel)]="codiceModuloSelezionato" name="modulo">
      <mat-option *ngFor="let modulo of moduli" [value]="modulo.codice">
        {{ modulo.nome }} ({{ modulo.codice }})
      </mat-option>
    </mat-select>
  </mat-form-field>
  
  <p *ngIf="moduli.length === 0" style="color: #999; font-style: italic;">
    Nessun modulo disponibile
  </p>
</mat-dialog-content>
<mat-dialog-actions align="end">
  <button mat-button (click)="annulla()">Annulla</button>
  <button mat-button color="primary" (click)="conferma()" [disabled]="!codiceModuloSelezionato">
    Iscrivi
  </button>
</mat-dialog-actions>
```

#### **Componenti UI:**
- `mat-select`: Dropdown per selezionare il modulo
- `mat-option`: Ogni opzione mostra nome e codice del modulo
- Bottone "Iscrivi" disabilitato finché non selezioni un modulo
- Empty state se non ci sono moduli disponibili

---

### 5️⃣ **Componente Dettaglio Studente (`dettaglistudente.ts`)**

#### **Import del Dialog**
```typescript
import { IscriviModuloDialogComponent } from './iscrivi-modulo-dialog';
```

#### **Metodo Iscrizione**
```typescript
iscriviModulo(): void {
  const dialogRef = this.dialog.open(IscriviModuloDialogComponent, {
    width: '400px'
  });

  dialogRef.afterClosed().subscribe(codiceModulo => {
    if (codiceModulo && this.studente && this.studente._id) {
      this.apiService.iscriviStudenteModulo(this.studente._id, codiceModulo).subscribe({
        next: (response) => {
          console.log('Iscrizione completata:', response);
          alert('Studente iscritto con successo al modulo!');
          // Ricarica i dati dello studente per aggiornare la lista moduli
          this.loadStudente(this.studente!._id!);
        },
        error: (err) => {
          console.error('Errore iscrizione:', err);
          alert('Errore durante l\'iscrizione al modulo');
        }
      });
    }
  });
}
```

#### **Flusso:**
1. Apre il dialog con larghezza 400px
2. Aspetta la chiusura del dialog (`afterClosed()`)
3. Se l'utente ha selezionato un modulo (codiceModulo non null)
4. Chiama l'API di iscrizione
5. In caso di successo, mostra alert e ricarica i dati dello studente
6. Il ricaricamento aggiorna automaticamente la lista "Moduli Iscritti"

---

### 6️⃣ **Template Dettaglio Studente (`dettaglistudente.html`)**

#### **Visualizzazione Moduli Iscritti**
```html
<!-- Moduli Iscritti -->
<div class="info-item full-width" *ngIf="studente.moduliIscritti && studente.moduliIscritti.length > 0">
  <span class="label">Moduli Iscritti</span>
  <span class="value">{{ studente.moduliIscritti.join(', ') }}</span>
</div>
<div class="info-item full-width" *ngIf="!studente.moduliIscritti || studente.moduliIscritti.length === 0">
  <span class="label">Moduli Iscritti</span>
  <span class="value" style="color: #999; font-style: italic;">Nessun modulo</span>
</div>
```

#### **Bottone Iscrizione**
```html
<mat-card-actions align="end">
  <button mat-button color="accent" (click)="iscriviModulo()">
    <mat-icon>add_circle</mat-icon> Iscrivi a Modulo
  </button>
  <button mat-button color="primary" (click)="modificaCredenziali()">
    <mat-icon>edit</mat-icon> Modifica Credenziali
  </button>
</mat-card-actions>
```

---

## 🔄 Flusso Completo

### **Scenario: Iscrizione di Mario Rossi al modulo "Programmazione Web"**

```
1. Utente naviga su Dettaglio Studente (Mario Rossi)
   ↓
2. Click su bottone "Iscrivi a Modulo"
   ↓
3. Frontend: this.dialog.open(IscriviModuloDialogComponent)
   ↓
4. Dialog: ngOnInit() → loadModuli()
   ↓
5. API Call: GET /moduli/ 
   ↓
6. Backend restituisce {moduli: [6 moduli]}
   ↓
7. Dialog mostra dropdown con 6 moduli
   ↓
8. Utente seleziona "Programmazione Web (ITS101)"
   ↓
9. Click su "Iscrivi"
   ↓
10. Dialog chiude e restituisce "ITS101"
    ↓
11. Frontend: iscriviStudenteModulo("507f1f77bcf86cd799439011", "ITS101")
    ↓
12. API Call: POST /studenti/507f1f77bcf86cd799439011/iscriviti/ITS101
    ↓
13. Backend aggiorna studente: moduliIscritti.push("ITS101")
    ↓
14. Backend aggiorna modulo: studentiIscritti.push({id, nome, cognome})
    ↓
15. Backend risponde: 201 Created con messaggio di successo
    ↓
16. Frontend mostra alert "Studente iscritto con successo!"
    ↓
17. Frontend: loadStudente(id) ricarica i dati
    ↓
18. La lista "Moduli Iscritti" ora mostra "ITS101"
```

---

## 🛠️ Problemi Risolti Durante l'Implementazione

### **Problema 1: ExpressionChangedAfterItHasBeenCheckedError**
**Sintomo:**
```
ERROR RuntimeError: NG0100: ExpressionChangedAfterItHasBeenCheckedError
Expression has changed after it was checked. Previous value: 'true'. Current value: 'false'
```

**Causa:** 
- La proprietà `loading` inizializzata a `true`
- Cambiata a `false` durante il ciclo di change detection (`ngOnInit → subscribe`)
- Angular rileva il cambio e lancia l'errore

**Soluzione:**
```typescript
// Prima (❌ errore)
loading = true;
loadModuli() {
  this.apiService.getModuli().subscribe({
    next: (data) => {
      this.moduli = data.moduli || data;
      this.loading = false; // Cambio durante change detection
    }
  });
}

// Dopo (✅ funziona)
loading = false; // Già false, nessun cambio necessario
loadModuli() {
  this.apiService.getModuli().subscribe({
    next: (data) => {
      this.moduli = data.moduli || data;
      // Non serve più modificare loading
    }
  });
}
```

### **Problema 2: Formato Risposta Backend**
**Backend restituisce:**
```json
{
  "moduli": [{...}, {...}]
}
```

**Non un array diretto:**
```json
[{...}, {...}]
```

**Soluzione:**
```typescript
this.moduli = data.moduli || data;
```
Estrae l'array dalla proprietà `moduli` se presente, altrimenti usa `data` direttamente.

---

## ✅ Vantaggi dell'Implementazione

### **1. Aggiornamento Bidirezionale**
- ✅ Lo studente ha la lista dei moduli a cui è iscritto
- ✅ Il modulo ha la lista degli studenti iscritti
- ✅ Consistenza dei dati garantita a livello backend

### **2. UX Ottimale**
- ✅ Dialog chiaro e intuitivo
- ✅ Dropdown con tutti i moduli disponibili
- ✅ Feedback immediato con alert di conferma
- ✅ Aggiornamento automatico della UI

### **3. Prevenzione Duplicati**
Backend verifica se lo studente è già iscritto:
```python
if codice_modulo in moduli_iscritti:
    return jsonify({"message": "Studente già iscritto a questo modulo"}), 200
```

### **4. Operatore MongoDB `$addToSet`**
Aggiunge l'elemento solo se non esiste già:
```python
{"$addToSet": {"moduliIscritti": codice_modulo}}
```

---

## 🎯 Possibili Estensioni

### **1. Mostrare solo moduli non già iscritti**
Filtrare nel dialog i moduli già presenti in `studente.moduliIscritti`:
```typescript
loadModuli(): void {
  this.apiService.getModuli().subscribe({
    next: (data: any) => {
      const tuttiModuli = data.moduli || data;
      // Filtra moduli già iscritti
      this.moduli = tuttiModuli.filter(m => 
        !this.moduliGiaIscritti.includes(m.codice)
      );
    }
  });
}
```

### **2. Disiscrizione da un modulo**
Aggiungere route backend:
```python
@studenti_bp.route("/<string:studente_id>/disiscrivi/<string:codice_modulo>", methods=["DELETE"])
```

E icona "X" accanto a ogni modulo nella lista.

### **3. Dettagli modulo nel dropdown**
Mostrare ore e descrizione oltre al nome:
```html
<mat-option *ngFor="let modulo of moduli" [value]="modulo.codice">
  <div style="display: flex; flex-direction: column;">
    <strong>{{ modulo.nome }}</strong>
    <small style="color: #666;">{{ modulo.ore }} ore - {{ modulo.descrizione }}</small>
  </div>
</mat-option>
```

### **4. Toast invece di Alert**
Usare `MatSnackBar` per notifiche più eleganti:
```typescript
this.snackBar.open('Studente iscritto con successo!', 'Chiudi', {
  duration: 3000,
  horizontalPosition: 'center',
  verticalPosition: 'top'
});
```

---

## 📋 Checklist Implementazione

- [x] Route backend `/studenti/{id}/iscriviti/{codice_modulo}`
- [x] Aggiornamento bidirezionale studente-modulo
- [x] Metodo API `iscriviStudenteModulo()` in `ApiService`
- [x] Componente dialog `IscriviModuloDialogComponent`
- [x] Template dialog con dropdown moduli
- [x] Import dialog in `dettaglistudente.ts`
- [x] Metodo `iscriviModulo()` nel componente dettaglio
- [x] Bottone "Iscrivi a Modulo" nel template
- [x] Visualizzazione moduli iscritti
- [x] Ricaricamento automatico dopo iscrizione
- [x] Gestione errori con alert
- [x] Prevenzione duplicati lato backend
- [x] Empty state "Nessun modulo" se lista vuota

---

## 🚀 Test della Funzionalità

### **1. Test Iscrizione Normale**
1. Apri dettaglio studente senza moduli iscritti
2. Click "Iscrivi a Modulo"
3. Seleziona un modulo dal dropdown
4. Click "Iscrivi"
5. Verifica alert di successo
6. Verifica che il modulo appaia in "Moduli Iscritti"

### **2. Test Prevenzione Duplicati**
1. Iscrivi studente a modulo "ITS101"
2. Riprova a iscriverlo allo stesso modulo
3. Backend dovrebbe restituire messaggio "già iscritto"

### **3. Test Annullamento**
1. Apri dialog
2. Click "Annulla" senza selezionare nulla
3. Dialog si chiude senza chiamate API

### **4. Test Verifica Bidirezionale**
1. Iscrivi studente a modulo
2. Vai su dettaglio modulo (quando implementato)
3. Verifica che lo studente appaia in "Studenti Iscritti"

---

📅 **Data documento:** 8 Dicembre 2025  
👤 **Autore:** GitHub Copilot  
🔧 **Progetto:** Gestione Corsi ITS
