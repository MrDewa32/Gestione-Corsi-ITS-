import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Corso } from './corso/corso';
import { FormRegistrazioneComponent } from './form-registrazione/form-registrazione';

export const routes: Routes = [
    { path: '', component: Homepage, title: 'Home' },
    { path: 'corsi', component: Corso, title: 'Corsi' },
    { path: 'registrazione', component: FormRegistrazioneComponent, title: 'Registrazione' },
];
