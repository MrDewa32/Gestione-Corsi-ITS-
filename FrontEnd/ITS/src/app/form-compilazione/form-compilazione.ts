import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-compilazione',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-compilazione.html',
  styleUrls: ['./form-compilazione.css'],
})
export class FormCompilazione {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  accedi() {
    if (this.loginForm.valid) {

      console.log("Dati inviati:", this.loginForm.value);

      // 👇 Navigazione dopo login riuscito
      this.router.navigate(['/corsi']); // <-- cambia percorso se vuoi

    } else {
      console.log("Form non valido");
    }
  }
}
