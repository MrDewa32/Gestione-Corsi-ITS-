import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-prova',
  imports: [
    MatSlideToggleModule,
    MatSliderModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatBadgeModule
  ],
  templateUrl: './prova.html',
  styleUrl: './prova.css',
})
export class Prova {

}
