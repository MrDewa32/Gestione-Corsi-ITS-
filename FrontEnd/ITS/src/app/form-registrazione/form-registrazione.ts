import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';


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

	constructor(private fb: FormBuilder) {
		this.form = this.fb.group({
			nome: ['', Validators.required],
			cognome: ['', Validators.required],
			email: ['', [Validators.required, Validators.email]],
			documento: ['', Validators.required],
			numeroDocumento: ['', Validators.required],
			domicilio: ['', Validators.required],
			corso: ['', Validators.required],
			telefono: ['', Validators.required],
			esitoTest: ['', Validators.required],
			colloquio: ['', Validators.required],
			password: ['', [Validators.required, Validators.minLength(6)]],
			noteInterne: ['']
		});
	}

	get f() {
		return this.form.controls;
	}

	onSubmit() {
		this.submitted = true;
		if (this.form.valid) {
			console.log('Nuovo studente:', this.form.value);
			// mostra messaggio di successo e reset form
			alert('Registrazione effettuata con successo');
			this.form.reset();
			this.submitted = false;
		}
	}
}