import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
	selector: 'app-form-registrazione',
	standalone: true,
	imports: [CommonModule, ReactiveFormsModule],
	templateUrl: './form-registrazione.html',
	styleUrls: ['./form-registrazione.css']
})
export class FormRegistrazioneComponent {
	form: FormGroup;
	submitted = false;

	constructor(private fb: FormBuilder, private router: Router) {
		this.form = this.fb.group({
			nome: ['', Validators.required],
			cognome: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			telefono: [''],
			documento: ['carta_identita'],
			numeroDocumento: ['', Validators.required],
			domicilio: [''],
			corso: ['developer'],
			esitoTest: [''],
			colloquio: [''],
			password: ['', [Validators.required, Validators.minLength(6)]],
			noteInterne: ['']
		});
	}

	// Getter per accedere facilmente ai controlli del form nel template
	get f() {
		return this.form.controls;
	}

	onSubmit() {
		this.submitted = true;

		if (this.form.valid) {
			console.log('Dati studente registrato:', this.form.value);
			
			// Qui puoi aggiungere la chiamata al servizio per salvare i dati
			// Per ora navighiamo alla lista studenti o alla home
			this.router.navigate(['/elencostudenti']);
		} else {
			console.log('Form non valido. Controlla i campi obbligatori.');
		}
	}
}