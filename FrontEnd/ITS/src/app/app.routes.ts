import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { Corso } from './corso/corso';
import { FormCompilazione } from './form-compilazione/form-compilazione';
import { Creacorso } from './creacorso/creacorso';
import { Elencostudenti } from './elencostudenti/elencostudenti';
import { Calendari } from './calendari/calendari';
import { Listaalunni } from './listaalunni/listaalunni';
import { Aggiungistudente } from './aggiungistudente/aggiungistudente';
import { Dettaglistudente } from './dettaglistudente/dettaglistudente';

export const routes: Routes = [
    { path: '', component: Homepage, title: 'Home' },
    { path: 'corsi', component: Corso, title: 'Corsi' },
    { path: 'login', component: FormCompilazione, title: 'Accedi' },
    { path: 'creacorso', component: Creacorso, title: 'Crea Corso' },
    { path: 'elencostudenti', component: Elencostudenti, title: 'Elenco Studenti' },
    { path: 'calendari', component: Calendari, title: 'Calendari' },
    { path: 'listaalunni', component: Listaalunni, title: 'Lista Studenti' },
    { path: 'aggiungistudente', component: Aggiungistudente, title: 'Aggiungi Studente' },
    { path: 'dettaglistudente/:id', component: Dettaglistudente, title: 'Dettagli Studente' },
];
