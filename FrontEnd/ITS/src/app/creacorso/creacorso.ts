import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-creacorso',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './creacorso.html',
  styleUrl: './creacorso.css',
})
export class Creacorso {
  materie: string[] = ['Informatica', 'Informatica2', 'Informatica3', 'Informatica4', 'Informatica5'];
  materieControl = new FormControl<string[]>([], {
    validators: [Validators.required]
  });
  
}
