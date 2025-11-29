import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Prova } from './prova/prova';
import { Navbar } from './navbar/navbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Footer } from './footer/footer';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Prova, Navbar, MatTooltipModule, Footer, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ITS');
}
