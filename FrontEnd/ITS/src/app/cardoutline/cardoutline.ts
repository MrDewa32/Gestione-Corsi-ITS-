import { Component, input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ModalDeleteCourseComponent } from '../modal-eliminacorso/modal-eliminacorso';

@Component({
  selector: 'app-cardoutline',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './cardoutline.html',
  styleUrl: './cardoutline.css',
})
export class Cardoutline {
  titolo = input<string>('');
  descrizione = input<string>('');
  
  private dialog = inject(MatDialog);

  openDeleteModal() {
    this.dialog.open(ModalDeleteCourseComponent, {
      width: '500px',
      data: { titolo: this.titolo() }
    });
  }
}
