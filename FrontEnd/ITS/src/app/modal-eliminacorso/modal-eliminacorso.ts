import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal-eliminacorso',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-eliminacorso.html',
  styleUrls: ['./modal-eliminacorso.css']
})

export class ModalDeleteCourseComponent {
  @Input() courseName: string = '';
  @Output() deleteConfirmed = new EventEmitter<string>();
  @Output() closed = new EventEmitter<void>();

  password: string = '';

  confirmDelete() {
    if (this.password) {
      this.deleteConfirmed.emit(this.password);
    }
  }

  close() {
    this.closed.emit();
  }
}
