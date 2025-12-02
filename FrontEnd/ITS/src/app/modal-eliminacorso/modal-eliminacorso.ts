import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'app-modal-eliminacorso',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
  ],
  templateUrl: './modal-eliminacorso.html',
  styleUrls: ['./modal-eliminacorso.css']
})

export class ModalDeleteCourseComponent {
  readonly dialogRef = inject(MatDialogRef<ModalDeleteCourseComponent>);
  readonly data = inject<{ titolo: string }>(MAT_DIALOG_DATA);
  
  password = '';
  hide = signal(true);

  clickEvent(event: MouseEvent): void {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    // Qui si aggiunge la logica per eliminare 
    // il corso ma ora chiude solo il dialog
    this.dialogRef.close({ confirmed: true, password: this.password });
  }
}

