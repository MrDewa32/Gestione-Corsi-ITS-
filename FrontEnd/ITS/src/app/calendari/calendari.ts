import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendari',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './calendari.html',
  styleUrl: './calendari.css',
})
export class Calendari {
  selectedDate: Date | null = new Date();

  events = [
    { title: 'Lezione Angular', time: '09:00 - 13:00', description: 'Introduzione ai Componenti', type: 'lecture' },
    { title: 'Pausa Pranzo', time: '13:00 - 14:00', description: 'Mensa', type: 'break' },
    { title: 'Laboratorio Java', time: '14:00 - 18:00', description: 'Esercitazione Spring Boot', type: 'lab' },
    { title: 'Esame Database', time: '09:00 - 11:00', description: 'SQL e Normalizzazione', type: 'exam' }
  ];

  onDateSelected(date: Date | null) {
    this.selectedDate = date;
    console.log('Selected date:', date);
    // In a real app, we would filter events based on the date here
  }
}
