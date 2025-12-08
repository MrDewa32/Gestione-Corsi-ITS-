import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ModuloCompleto } from '../dettagliomodulo/dettagliomodulo';

@Component({
  selector: 'app-modifica-modulo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './modifica-modulo-dialog.html',
  styleUrl: './modifica-modulo-dialog.css'
})
export class ModificaModuloDialogComponent {
  modulo: ModuloCompleto;

  constructor(
    public dialogRef: MatDialogRef<ModificaModuloDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ModuloCompleto
  ) {
    // Crea una copia per evitare di modificare l'originale
    this.modulo = { ...data };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.modulo.codice && this.modulo.nome && this.modulo.ore > 0) {
      this.dialogRef.close(this.modulo);
    }
  }
}
