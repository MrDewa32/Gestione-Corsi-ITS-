import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Prova } from './prova/prova';
import { Navbar } from './navbar/navbar';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Prova, Navbar, MatTooltipModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ITS');
}
