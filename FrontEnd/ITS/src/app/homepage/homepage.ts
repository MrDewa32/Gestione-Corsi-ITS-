import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Offerta } from '../offerta/offerta';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterModule, Offerta],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {
  
}
