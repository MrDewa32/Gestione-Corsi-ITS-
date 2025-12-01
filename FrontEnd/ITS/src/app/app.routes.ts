import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Corso } from './corso/corso';
import { FormRegistrazioneComponent } from './form-registrazione/form-registrazione';
import { FormCompilazione } from './form-compilazione/form-compilazione';

export const routes: Routes = [
    { path: '', component: Homepage, title: 'Home' },
    { path: 'corsi', component: Corso, title: 'Corsi' },
    { path: 'form-registrazione', component: FormRegistrazioneComponent, title: 'Registrazione' },
    { path: 'login', component: FormCompilazione, title: 'Accedi' }, // 👈 Aggiunto
];

