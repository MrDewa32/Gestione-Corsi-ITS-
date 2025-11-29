import { Component, ViewChild } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatMenuModule } from '@angular/material/menu';


@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatSidenavModule, MatMenuModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  toggleMenu() {
    this.trigger.toggleMenu();
  }
}
