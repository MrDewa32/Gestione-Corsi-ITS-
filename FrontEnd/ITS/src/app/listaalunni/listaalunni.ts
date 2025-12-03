import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';

export interface AlunnoElement {
  position: number;
  name: string;
  voto: number;
  symbol: string;
}

const ELEMENT_DATA: AlunnoElement[] = [
  {position: 1, name: 'Mario Rossi', voto: 1, symbol: 'H'},
  {position: 2, name: 'Luca Bianchi', voto: 4, symbol: 'He'},
  {position: 3, name: 'Anna Verdi', voto: 6, symbol: 'Li'},
  {position: 4, name: 'Giulia Neri', voto: 9, symbol: 'Be'},
  {position: 5, name: 'Marco Ferrari', voto: 10, symbol: 'B'},
  {position: 6, name: 'Sara Romano', voto: 12, symbol: 'C'},
  {position: 7, name: 'Paolo Colombo', voto: 14, symbol: 'N'},
  {position: 8, name: 'Elena Ricci', voto: 15, symbol: 'O'},
  {position: 9, name: 'Andrea Marino', voto: 18, symbol: 'F'},
  {position: 10, name: 'Chiara Greco', voto: 20, symbol: 'Ne'},
];

@Component({
  selector: 'app-listaalunni',
  imports: [CommonModule, RouterLink, MatListModule, MatTableModule],
  templateUrl: './listaalunni.html',
  styleUrl: './listaalunni.css',
})
export class Listaalunni {
  displayedColumns: string[] = ['position', 'name', 'voto', 'symbol'];
  dataSource = ELEMENT_DATA;
}
