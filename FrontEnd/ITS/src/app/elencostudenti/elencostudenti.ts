import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AggiungiStudenteDialog } from './aggiungi-studente-dialog';
import { ApiService } from '../services/api';

export interface Studente {
  _id?: string;  // ID di MongoDB (opzionale per nuovi studenti)
  id?: number;   // Manteniamo per compatibilità
  matricola?: string; // Opzionale
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
    MatDialogModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    RouterModule
  ],
  templateUrl: './elencostudenti.html',
  styleUrls: ['./elencostudenti.css'],
})
export class Elencostudenti implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['matricola', 'nome', 'cognome', 'email', 'corso', 'stato', 'azioni'];
  dataSource = new MatTableDataSource<Studente>([]);
  showFilter = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.loadStudenti();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadStudenti(): void {
    this.apiService.getStudenti().subscribe({
      next: (studenti) => {
        this.dataSource.data = studenti;
      },
      error: (errore) => {
        console.error('❌ Errore nel caricamento studenti:', errore);
        alert('Errore nel caricamento degli studenti dal server!');
      }
    });
  }

  marcaVisualizzato(id: string): void {
    const studente = this.dataSource.data.find(s => s._id === id);
    if (studente) {
      studente.visualizzato = !studente.visualizzato;
      
      // Aggiorna sul backend
      this.apiService.aggiornaStudente(id, studente).subscribe({
        next: () => console.log('Studente aggiornato'),
        error: (err) => console.error('Errore aggiornamento:', err)
      });
    }
  }

  rimuoviIscrizione(id: string): void {
    this.apiService.eliminaStudente(id).subscribe({
      next: () => {
        console.log('Studente eliminato con successo');
        this.loadStudenti();
      },
      error: (errore) => {
        console.error('Errore nell\'eliminazione:', errore);
        alert('Errore nell\'eliminazione dello studente!');
      }
    });
  }

  aggiungiStudente(): void {
    const dialogRef = this.dialog.open(AggiungiStudenteDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Crea il nuovo studente e invialo al backend
        const nuovoStudente = {
          matricola: result.matricola,
          nome: result.nome,
          cognome: result.cognome,
          email: result.email,
          corso: result.corso,
          stato: result.stato,
          visualizzato: false
        };

        // CHIAMATA AL BACKEND per creare lo studente
        this.apiService.creaStudente(nuovoStudente).subscribe({
          next: (studente) => {
            console.log('Studente creato:', studente);
            this.loadStudenti();
          },
          error: (errore) => {
            console.error('Errore nella creazione:', errore);
            alert('Errore nella creazione dello studente!');
          }
        });
      }
    });
  }

  ordina(): void {
    if (this.dataSource.sort) {
      const currentSort = this.dataSource.sort.active === 'nome' ? this.dataSource.sort.direction : '';
      const newDirection = currentSort === 'asc' ? 'desc' : 'asc';

      const sortState: any = { active: 'nome', direction: newDirection };
      this.dataSource.sort.active = sortState.active;
      this.dataSource.sort.direction = sortState.direction;
      this.dataSource.sort.sortChange.emit(sortState);
    }
  }

  filtra(): void {
    this.showFilter = !this.showFilter;
    if (!this.showFilter) {
      this.dataSource.filter = '';
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
