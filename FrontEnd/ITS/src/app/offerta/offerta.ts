import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Cardoutline } from '../cardoutline/cardoutline';

@Component({
  selector: 'app-offerta',
  imports: [CommonModule, Cardoutline],
  templateUrl: './offerta.html',
  styleUrl: './offerta.css',
})
export class Offerta {
  corsi = [
    {titolo: "Developer", descrizione: "Sviluppo software e applicazioni", badge: 1},
    {titolo: "AI Specialist", descrizione: "Intelligenza artificiale e machine learning", badge: 2},
    {titolo: "Cybersecurity", descrizione: "Sicurezza informatica e protezione dati", badge: 3},
    {titolo: "3D Artist", descrizione: "Modellazione e animazione 3D", badge: 4},
    {titolo: "Digital Media", descrizione: "Comunicazione e marketing digitale", badge: 5},
    {titolo: "Game Developer", descrizione: "Sviluppo videogiochi e gamification", badge: 6},
    {titolo: "Cloud Engineer", descrizione: "Infrastrutture cloud e DevOps", badge: 0},
    {titolo: "Data Analyst", descrizione: "Analisi dati e business intelligence", badge: 0},
    {titolo: "UX/UI Designer", descrizione: "Design interfacce e user experience", badge: 0},
    {titolo: "IoT Specialist", descrizione: "Internet of Things e sistemi embedded", badge: 0},
  ];
}
