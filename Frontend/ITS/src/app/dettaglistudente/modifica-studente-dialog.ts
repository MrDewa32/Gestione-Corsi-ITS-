import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

export interface StudenteData {
  _id?: string;
  nome: string;
  cognome: string;
  email: string;
}

@Component({
  selector: 'app-modifica-studente-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './modifica-studente-dialog.html',
  styleUrl: './modifica-studente-dialog.css'
})
export class ModificaStudenteDialogComponent {
  studente: StudenteData;

  constructor(
    public dialogRef: MatDialogRef<ModificaStudenteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudenteData
  ) {
    // Crea una copia per evitare di modificare l'originale
    this.studente = { ...data };
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.studente.nome && this.studente.cognome && this.studente.email) {
      this.dialogRef.close(this.studente);
    }
  }
}
