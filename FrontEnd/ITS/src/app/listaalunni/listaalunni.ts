import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface AlunnoElement {
  position: number;
  nome: string;
  voto: number;
}

const ELEMENT_DATA: AlunnoElement[] = [
  {position: 1, nome: 'Mario Rossi', voto: 1},
  {position: 2, nome: 'Luca Bianchi', voto: 4},
  {position: 3, nome: 'Anna Verdi', voto: 6},
  {position: 4, nome: 'Giulia Neri', voto: 9},
  {position: 5, nome: 'Marco Ferrari', voto: 10},
  {position: 6, nome: 'Sara Romano', voto: 12},
  {position: 7, nome: 'Paolo Colombo', voto: 14},
  {position: 8, nome: 'Elena Ricci', voto: 15},
  {position: 9, nome: 'Andrea Marino', voto: 18},
  {position: 10, nome: 'Chiara Greco', voto: 20},
];

@Component({
  selector: 'app-listaalunni',
  imports: [CommonModule, MatListModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './listaalunni.html',
  styleUrl: './listaalunni.css',
})
export class Listaalunni {
  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['nome', 'voto', 'position'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: AlunnoElement | null = null;

  /** Checks whether an element is expanded. */
  isExpanded(element: AlunnoElement) {
    return this.expandedElement === element;
  }

  /** Toggles the expanded state of an element. */
  toggle(element:AlunnoElement) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }

  /** Promuove uno studente. */
  promuovi(element: AlunnoElement) {
    console.log('Promuovi studente:', element.nome);
    // TODO: Implementare la logica di promozione
  }

  /** Boccia uno studente. */
  boccia(element: AlunnoElement) {
    console.log('Boccia studente:', element.nome);
    // TODO: Implementare la logica di bocciatura
  }
}
