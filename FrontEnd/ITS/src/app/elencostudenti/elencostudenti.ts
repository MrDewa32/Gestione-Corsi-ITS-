import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface Studente {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  corso: string;
  stato: 'ammesso' | 'non_ammesso' | 'sospeso';
  visualizzato: boolean;
}

@Component({
  selector: 'app-elencostudenti',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatTooltipModule,
  ],
  templateUrl: './elencostudenti.html',
  styleUrls: ['./elencostudenti.css'],
})
export class Elencostudenti implements OnInit {
  displayedColumns: string[] = ['nome', 'cognome', 'email', 'corso', 'stato', 'azioni'];
  dataSource: Studente[] = [];

  ngOnInit(): void {
    this.loadStudenti();
  }

  loadStudenti(): void {
    this.dataSource = [
      {
        id: 1,
        nome: 'Luca',
        cognome: 'Marinelli',
        email: 'luca.marinelli@example.com',
        corso: 'Developer - Sviluppatore Software',
        stato: 'ammesso',
        visualizzato: false,
      },
      {
        id: 2,
        nome: 'Anna',
        cognome: 'Rossi',
        email: 'anna.rossi@example.com',
        corso: 'Game Developer',
        stato: 'non_ammesso',
        visualizzato: false,
      },
      {
        id: 3,
        nome: 'Marco',
        cognome: 'Bianchi',
        email: 'marco.bianchi@example.com',
        corso: 'Cyber Security',
        stato: 'sospeso',
        visualizzato: false,
      },
    ];
  }

  marcaVisualizzato(id: number): void {
    const studente = this.dataSource.find(s => s.id === id);
    if (studente) {
      studente.visualizzato = !studente.visualizzato;
    }
  }

  rimuoviIscrizione(id: number): void {
    this.dataSource = this.dataSource.filter(s => s.id !== id);
  }

  aggiungiStudente(): void {
    // TODO: Navigare a pagina di aggiunta o aprire modal
    console.log('Aggiungi nuovo studente');
  }

  ordina(): void {
    // TODO: Implementare logica di ordinamento
    console.log('Ordina studenti');
  }

  filtra(): void {
    // TODO: Implementare logica di filtraggio
    console.log('Filtra studenti');
  }

  getStatoClass(stato: string): string {
    switch (stato) {
      case 'ammesso':
        return 'stato-ammesso';
      case 'non_ammesso':
        return 'stato-non-ammesso';
      case 'sospeso':
        return 'stato-sospeso';
      default:
        return '';
    }
  }

  getStatoLabel(stato: string): string {
    switch (stato) {
      case 'ammesso':
        return 'Ammesso';
      case 'non_ammesso':
        return 'Non Ammesso';
      case 'sospeso':
        return 'Sospeso';
      default:
        return 'Sconosciuto';
    }
  }
}
