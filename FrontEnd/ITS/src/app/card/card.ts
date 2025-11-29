import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-card',
  imports: [
    MatSlideToggleModule,
    MatSliderModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card {
  titolo = input<string>('');
  descrizione = input<string>('');
  badge = input<number>();
}
