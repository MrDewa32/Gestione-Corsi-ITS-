import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../services/api';
import { ModificaModuloDialogComponent } from './modifica-modulo-dialog';

// Interfaccia per studente iscritto (come arriva dal backend)
export interface StudenteIscritto {
  studente_id: string;
  nome: string;
}

// Interfaccia per modulo con studenti completi
export interface ModuloCompleto {
  _id?: string;
  codice: string;
  nome: string;
  ore: number;
  descrizione: string;
  studentiIscritti?: StudenteIscritto[];
}

@Component({
  selector: 'app-dettagliomodulo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatDialogModule
  ],
  templateUrl: './dettagliomodulo.html',
  styleUrl: './dettagliomodulo.css',
})
export class DettaglioModulo implements OnInit {
  modulo: ModuloCompleto | null = null;
  studentiIscritti: StudenteIscritto[] = [];
  displayedColumns: string[] = ['nome', 'azioni'];

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadModulo(id);
    } else {
      console.error('Nessun ID trovato nella route!');
    }
  }

  loadModulo(id: string): void {
    console.log('🔍 Caricamento modulo con ID:', id);
    this.apiService.getModuloByID(id).subscribe({
      next: (data: any) => {
        console.log('✅ Dati modulo ricevuti:', data);
        // Il backend restituisce {modulo: {...}}
        this.modulo = data.modulo || data;
        this.studentiIscritti = this.modulo?.studentiIscritti || [];
        console.log('📦 Modulo caricato:', this.modulo);
        console.log('👥 Studenti iscritti:', this.studentiIscritti);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Errore caricamento modulo:', err);
      }
    });
  }

  goBack(): void {
    window.history.back();
  }

  modificaModulo(): void {
    if (!this.modulo) return;

    const dialogRef = this.dialog.open(ModificaModuloDialogComponent, {
      width: '500px',
      data: this.modulo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.modulo?._id) {
        console.log('📝 Modifica modulo:', result);
        // Rimuovo _id e studentiIscritti dal body della richiesta
        const { _id, studentiIscritti, ...moduloData } = result;
        this.apiService.aggiornaModulo(this.modulo._id, moduloData).subscribe({
          next: (response) => {
            console.log('✅ Modulo aggiornato:', response);
            alert('Modulo aggiornato con successo!');
            this.loadModulo(this.modulo!._id!);
          },
          error: (err) => {
            console.error('❌ Errore aggiornamento modulo:', err);
            alert('Errore durante l\'aggiornamento del modulo!');
          }
        });
      }
    });
  }

  eliminaModulo(): void {
    if (confirm('Sei sicuro di voler eliminare questo modulo?')) {
      if (this.modulo && this.modulo._id) {
        this.apiService.eliminaModulo(this.modulo._id).subscribe({
          next: () => {
            alert('Modulo eliminato con successo!');
            this.goBack();
          },
          error: (err) => {
            console.error('Errore eliminazione modulo:', err);
            alert('Errore durante l\'eliminazione del modulo');
          }
        });
      }
    }
  }

  visualizzaStudente(studenteId: string): void {
    window.location.href = `/dettagli-studente/${studenteId}`;
  }
}
