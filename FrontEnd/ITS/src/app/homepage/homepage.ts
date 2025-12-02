import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Offerta } from '../offerta/offerta';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [RouterModule, Offerta, MatButtonModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {
  nome = "Ciccio"
}
