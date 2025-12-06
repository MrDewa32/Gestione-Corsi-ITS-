import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { ApiService } from '../services/api';
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

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadStudente(id);
    } else {
      console.error('❌ Nessun ID trovato nella route!');
      this.loading = false;
    }
  }

  loadStudente(id: string): void {
    this.apiService.getStudentiByID(id).subscribe({
      next: (data: any) => {
        this.studente = data;
        this.loading = false;
        console.log('✅ Dettagli studente caricati');
      },
      error: (err) => {
        console.error('❌ Errore caricamento dettagli:', err);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    window.history.back();
  }

  modificaCredenziali(): void {
    console.log('Modifica credenziali click');
    // TODO: Implement dialog to modify credentials
  }

  gestisciEsami(): void {
    console.log('Gestisci esami click');
    // TODO: Implement dialog to manage exams
  }
}
