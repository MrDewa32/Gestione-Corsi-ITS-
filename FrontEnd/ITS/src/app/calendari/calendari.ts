import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface EventData {
  title: string;
  time: string;
  description: string;
  type: string;
  date: Date;
}

@Component({
  selector: 'event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule
  ],
  template: `
    <h2 mat-dialog-title>Aggiungi Nuovo Evento</h2>
    <mat-dialog-content>
      <div class="form-container" style="display: flex; flex-direction: column; gap: 16px; min-width: 300px;">
        <mat-form-field appearance="fill">
          <mat-label>Titolo</mat-label>
          <input matInput [(ngModel)]="data.title">
        </mat-form-field>
        
        <div style="display: flex; gap: 16px;">
          <mat-form-field appearance="fill" style="flex: 1;">
            <mat-label>Ora Inizio</mat-label>
            <input matInput type="time" [(ngModel)]="startTime">
          </mat-form-field>
          <mat-form-field appearance="fill" style="flex: 1;">
            <mat-label>Ora Fine</mat-label>
            <input matInput type="time" [(ngModel)]="endTime">
          </mat-form-field>
        </div>

        <mat-form-field appearance="fill">
          <mat-label>Descrizione</mat-label>
          <textarea matInput [(ngModel)]="data.description"></textarea>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Tipo</mat-label>
          <mat-select [(ngModel)]="data.type">
            <mat-option value="lecture">Lezione</mat-option>
            <mat-option value="exam">Esame</mat-option>
            <mat-option value="lab">Laboratorio</mat-option>
            <mat-option value="break">Pausa</mat-option>
            <mat-option value="internship">Uscita/Tirocinio</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Annulla</button>
      <button mat-button color="primary" (click)="onSave()" cdkFocusInitial>Salva</button>
    </mat-dialog-actions>
  `
})
export class EventDialog {
  startTime: string = '09:00';
  endTime: string = '10:00';

  constructor(
    public dialogRef: MatDialogRef<EventDialog>,
    @Inject(MAT_DIALOG_DATA) public data: EventData,
  ) {
    if (data.time) {
      const times = data.time.split(' - ');
      if (times.length === 2) {
        this.startTime = times[0];
        this.endTime = times[1];
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.data.time = `${this.startTime} - ${this.endTime}`;
    this.dialogRef.close(this.data);
  }
}

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
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './calendari.html',
  styleUrl: './calendari.css',
})
export class Calendari {
  selectedDate: Date | null = new Date();
  allEvents: EventData[] = [];
  filteredEvents: EventData[] = [];

  constructor(public dialog: MatDialog, private snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {
    this.loadEvents();
  }

  loadEvents() {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      this.allEvents = JSON.parse(storedEvents).map((e: any) => ({
        ...e,
        date: new Date(e.date)
      }));
    } else {
      // Dummy data for initial load
      this.allEvents = [
        { title: 'Lezione Angular', time: '09:00 - 13:00', description: 'Introduzione ai Componenti', type: 'lecture', date: new Date() },
        { title: 'Pausa Pranzo', time: '13:00 - 14:00', description: 'Mensa', type: 'break', date: new Date() }
      ];
      this.saveEvents();
    }
    this.filterEvents();
  }

  saveEvents() {
    localStorage.setItem('calendarEvents', JSON.stringify(this.allEvents));
  }

  filterEvents() {
    if (!this.selectedDate) {
      this.filteredEvents = [];
      return;
    }

    this.filteredEvents = this.allEvents.filter(event =>
      event.date.getDate() === this.selectedDate!.getDate() &&
      event.date.getMonth() === this.selectedDate!.getMonth() &&
      event.date.getFullYear() === this.selectedDate!.getFullYear()
    );
  }

  onDateSelected(date: Date | null) {
    this.selectedDate = date;
    this.filterEvents();
  }

  parseTime(timeStr: string): { hours: number, minutes: number } | null {
    const match = timeStr.match(/(\d{1,2}):(\d{2})/);
    if (!match) return null;
    return {
      hours: parseInt(match[1], 10),
      minutes: parseInt(match[2], 10)
    };
  }

  checkOverlap(newEvent: EventData): boolean {
    // Get events for the same date
    const sameDayEvents: EventData[] = this.allEvents.filter(event =>
      event.date.getDate() === newEvent.date.getDate() &&
      event.date.getMonth() === newEvent.date.getMonth() &&
      event.date.getFullYear() === newEvent.date.getFullYear()
    );

    if (sameDayEvents.length === 0) return false;

    // Parse new event time range
    const timeParts = newEvent.time.split(' - ');
    if (timeParts.length !== 2) return false;

    const newStart = this.parseTime(timeParts[0]);
    const newEnd = this.parseTime(timeParts[1]);
    if (!newStart || !newEnd) return false;

    const newStartMinutes = newStart.hours * 60 + newStart.minutes;
    const newEndMinutes = newEnd.hours * 60 + newEnd.minutes;

    // Check against each existing event
    for (const event of sameDayEvents) {
      const eventTimeParts = event.time.split(' - ');
      if (eventTimeParts.length !== 2) continue;

      const eventStart = this.parseTime(eventTimeParts[0]);
      const eventEnd = this.parseTime(eventTimeParts[1]);
      if (!eventStart || !eventEnd) continue;

      const eventStartMinutes = eventStart.hours * 60 + eventStart.minutes;
      const eventEndMinutes = eventEnd.hours * 60 + eventEnd.minutes;

      // Check for overlap: new event starts before existing ends AND new event ends after existing starts
      if (newStartMinutes < eventEndMinutes && newEndMinutes > eventStartMinutes) {
        return true; // Overlap detected
      }
    }

    return false;
  }

  openAddEventDialog(): void {
    if (!this.selectedDate) return;

    const dialogRef = this.dialog.open(EventDialog, {
      data: { title: '', time: '', description: '', type: 'lecture', date: this.selectedDate },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.date = new Date(this.selectedDate!.getTime());

        // Check for overlap
        if (this.checkOverlap(result)) {
          this.snackBar.open('Errore: questo evento si sovrappone con un evento esistente!', 'Chiudi', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
          return;
        }

        // Use spread to create new array reference for change detection
        this.allEvents = [...this.allEvents, result];
        this.saveEvents();
        this.filterEvents();
        this.cdr.detectChanges();

        this.snackBar.open('Evento aggiunto con successo!', 'Chiudi', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    });
  }

  deleteEvent(event: EventData): void {
    // Remove event from allEvents
    this.allEvents = this.allEvents.filter(e => e !== event);
    this.saveEvents();
    this.filterEvents();
  }
}
