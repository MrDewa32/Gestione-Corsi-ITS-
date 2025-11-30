import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-cardoutline',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './cardoutline.html',
  styleUrl: './cardoutline.css',
})
export class Cardoutline {
  titolo = input<string>('');
  descrizione = input<string>('');
}
