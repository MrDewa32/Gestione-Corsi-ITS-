import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Studente } from './elencostudenti';

@Component({
  selector: 'app-aggiungi-studente-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './aggiungi-studente-dialog.html',
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    .student-form {
      display: flex;
      flex-direction: column;
      min-width: 300px;
    }
  `]
})
export class AggiungiStudenteDialog {
  studentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AggiungiStudenteDialog>
  ) {
    this.studentForm = this.fb.group({
      matricola: ['', Validators.required],
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      corso: ['', Validators.required],
      stato: ['ammesso', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.studentForm.valid) {
      const newStudent: Partial<Studente> = {
        ...this.studentForm.value,
        visualizzato: false
      };
      this.dialogRef.close(newStudent);
    }
  }
}
