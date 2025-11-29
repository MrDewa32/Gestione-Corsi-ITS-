import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Footer } from './footer/footer';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    Navbar,
    MatTooltipModule,
    Footer,
    MatIconModule,
    MatDividerModule,
    RouterModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ITS');
}
