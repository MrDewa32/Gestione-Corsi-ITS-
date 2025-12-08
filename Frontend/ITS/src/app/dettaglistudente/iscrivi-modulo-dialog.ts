import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../services/api';
import { Modulo } from '../corso/corso';

@Component({
  selector: 'app-iscrivi-modulo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './iscrivi-modulo-dialog.html',
})
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

  conferma(): void {
    if (this.codiceModuloSelezionato) {
      this.dialogRef.close(this.codiceModuloSelezionato);
    }
  }

  annulla(): void {
    this.dialogRef.close();
  }
}
