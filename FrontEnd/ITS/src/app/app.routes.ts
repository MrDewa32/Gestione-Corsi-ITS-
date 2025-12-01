import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Corso } from './corso/corso';
import { FormCompilazione } from './form-compilazione/form-compilazione';
import { Creacorso } from './creacorso/creacorso';

export const routes: Routes = [
    { path: '', component: Homepage, title: 'Home' },
    { path: 'corsi', component: Corso, title: 'Corsi' },
    { path: 'login', component: FormCompilazione, title: 'Accedi' },
    { path: 'creacorso', component: Creacorso, title: 'Crea Corso' },
];
