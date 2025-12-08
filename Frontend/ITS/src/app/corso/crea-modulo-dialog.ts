import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crea-modulo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './crea-modulo-dialog.html',
  styleUrl: './crea-modulo-dialog.css'
})
export class CreaModuloDialogComponent {
  modulo = {
    codice: '',
    nome: '',
    ore: 0,
    descrizione: ''
  };

  constructor(
    public dialogRef: MatDialogRef<CreaModuloDialogComponent>
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.modulo.codice && this.modulo.nome && this.modulo.ore > 0) {
      this.dialogRef.close(this.modulo);
    }
  }
}
