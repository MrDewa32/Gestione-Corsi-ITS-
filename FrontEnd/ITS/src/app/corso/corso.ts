import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Card } from '../card/card';
import { ApiService } from '../services/api';

// Interfaccia Modulo (come nel backend)
export interface Modulo {
  _id?: string;
  codice: string;
  nome: string;
  ore: number;
  descrizione: string;
  studentiIscritti?: string[];
}

@Component({
  selector: 'app-corso',
  standalone: true,
  imports: [
    CommonModule,
    Card,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './corso.html',
  styleUrl: './corso.css',
})
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
    console.log('🔍 Inizio caricamento moduli...');
    this.apiService.getModuli().subscribe({
      next: (data: any) => {
        console.log('✅ Moduli ricevuti:', data);
        // Il backend restituisce {moduli: [...]} quindi estraiamo l'array
        this.moduli = data.moduli || data;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Errore caricamento moduli:', err);
        alert('Errore nel caricamento dei moduli dal server!');
        this.loading = false;
      }
    });
  }

  visualizzaDettaglio(moduloId: string): void {
    this.router.navigate(['/dettagliomodulo', moduloId]);
  }
}
