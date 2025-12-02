import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
    MatDialogModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './elencostudenti.html',
  styleUrls: ['./elencostudenti.css'],
})
export class Elencostudenti implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nome', 'cognome', 'email', 'corso', 'stato', 'azioni'];
  dataSource = new MatTableDataSource<Studente>([]);
  showFilter = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadStudenti();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  loadStudenti(): void {
    const savedStudenti = localStorage.getItem('studenti');
    if (savedStudenti) {
      this.dataSource.data = JSON.parse(savedStudenti);
    } else {
      const defaultStudenti: Studente[] = [
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
      this.dataSource.data = defaultStudenti;
      this.saveStudenti();
    }
  }

  saveStudenti(): void {
    localStorage.setItem('studenti', JSON.stringify(this.dataSource.data));
  }

  marcaVisualizzato(id: number): void {
    const studente = this.dataSource.data.find(s => s.id === id);
    if (studente) {
      studente.visualizzato = !studente.visualizzato;
      this.saveStudenti();
    }
  }

  rimuoviIscrizione(id: number): void {
    this.dataSource.data = this.dataSource.data.filter(s => s.id !== id);
    this.saveStudenti();
  }

  aggiungiStudente(): void {
    const dialogRef = this.dialog.open(AggiungiStudenteDialog, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Generate a new ID (simple max + 1 logic for now)
        const currentData = this.dataSource.data;
        const newId = currentData.length > 0
          ? Math.max(...currentData.map(s => s.id)) + 1
          : 1;

        const newStudent: Studente = {
          id: newId,
          ...result
        };

        // Update dataSource
        this.dataSource.data = [...currentData, newStudent];
        this.saveStudenti();
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
