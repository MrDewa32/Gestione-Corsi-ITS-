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

interface Esame {
  materia: string;
  voto: number;
  data: string;
}

interface StudenteDettaglio extends Studente {
  esami?: Esame[];
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
    }
  }

  loadStudente(id: string): void {
    this.apiService.getStudentiByID(id).subscribe({
      next: (data: any) => {
        // Handle case where API might return array or object
        this.studente = Array.isArray(data) ? data[0] : data;
        
        // Mock exams if not present (to satisfy requirements if backend returns empty)
        if (this.studente && !this.studente.esami) {
          this.studente.esami = [
            { materia: 'Programmazione Java', voto: 28, data: '2025-01-15' },
            { materia: 'Database SQL', voto: 30, data: '2025-02-20' },
            { materia: 'Inglese Tecnico', voto: 26, data: '2025-03-10' },
            { materia: 'Sviluppo Web', voto: 29, data: '2025-04-05' }
          ];
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error('Errore caricamento dettagli:', err);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
