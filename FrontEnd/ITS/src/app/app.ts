import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Card } from './card/card';
import { Navbar } from './navbar/navbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Footer } from './footer/footer';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Card, Navbar, MatTooltipModule, Footer, MatIconModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ITS');

  dati = [
    {titolo: "titolo1", descrizione: "descrizione1", badge: 1},
    {titolo: "titolo2", descrizione: "descrizione2", badge: 2},
    {titolo: "titolo3", descrizione: "descrizione3", badge: 3},
    {titolo: "titolo4", descrizione: "descrizione4", badge: 4},
    {titolo: "titolo5", descrizione: "descrizione5", badge: 5},
    {titolo: "titolo6", descrizione: "descrizione6", badge: 6},
    {titolo: "titolo7", descrizione: "descrizione7", badge: 0},
    {titolo: "titolo8", descrizione: "descrizione8", badge: 0},
    {titolo: "titolo9", descrizione: "descrizione9", badge: 0},
    {titolo: "titolo10", descrizione: "descrizione10", badge: 0},
  ];

}
