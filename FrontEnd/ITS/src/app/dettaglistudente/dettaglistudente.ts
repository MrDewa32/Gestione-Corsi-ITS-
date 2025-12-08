import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '../services/api';
import { MatDialog } from '@angular/material/dialog';
import { AggiungiEsameDialogComponent } from './aggiungiesame-dialog';
import { IscriviModuloDialogComponent } from './iscrivi-modulo-dialog';
import { ModificaStudenteDialogComponent } from './modifica-studente-dialog';
import { Studente } from '../elencostudenti/elencostudenti';

// Struttura del modulo dentro un esame
interface Modulo {
  codice: string;
  nome: string;
  ore: number;
  descrizione: string;
}

// Struttura di un esame (come arriva dal backend)
interface Esame {
  data: string;
  voto: number;
  note: string;
  modulo: Modulo;  // Il modulo è un oggetto annidato
}

// Studente completo con tutti i campi del backend
interface StudenteDettaglio extends Studente {
  matricola?: string;           // Campo che aggiungerai
  moduliIscritti?: string[];    // Array di codici modulo
  esami?: Esame[];              // Array di esami
}

@Component({
  selector: 'app-dettaglistudente',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule
  ],
  templateUrl: './dettaglistudente.html',
  styleUrl: './dettaglistudente.css',
})
export class Dettaglistudente implements OnInit {
  studente: StudenteDettaglio | null = null;
  loading = true;
  mediaVoti: number | null = null;
  votiAlti: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadStudente(id);
      this.loadStatistiche(id);
    } else {
      console.error('Nessun ID trovato nella route!');
      this.loading = false;
    }
  }

  loadStudente(id: string): void {
    this.apiService.getStudentiByID(id).subscribe({
      next: (data: any) => {
        this.studente = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore caricamento dettagli:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

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

  goBack(): void {
    window.history.back();
  }

  modificaCredenziali(): void {
    if (!this.studente) return;

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
        console.log('📝 Modifica studente:', result);
        // Rimuovo _id dal body della richiesta
        const { _id, ...studenteData } = result;
        this.apiService.aggiornaStudente(this.studente._id, studenteData).subscribe({
          next: (response) => {
            console.log('✅ Studente aggiornato:', response);
            alert('Credenziali aggiornate con successo!');
            this.loadStudente(this.studente!._id!);
          },
          error: (err) => {
            console.error('❌ Errore aggiornamento studente:', err);
            alert('Errore durante l\'aggiornamento delle credenziali!');
          }
        });
      }
    });
  }

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

  gestisciEsami(): void {
    const dialogRef = this.dialog.open(AggiungiEsameDialogComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.studente && this.studente._id) {
        // Crea nuovo esame da result
        const nuovoEsame = {
          data: result.data,
          voto: result.voto,
          note: result.note,
          modulo: {
            nome: result.modulo,
            codice: '',
            ore: 0,
            descrizione: ''
          }
        };
        // Aggiorna array esami localmente
        const esamiAggiornati = this.studente.esami ? [...this.studente.esami, nuovoEsame] : [nuovoEsame];
        const studenteId = this.studente._id;
        // Aggiorna lo studente lato backend
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
}
