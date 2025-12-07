import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private apiUrl = 'http://127.0.0.1:5000'; 

  constructor(private http: HttpClient) {}

  // Metodi per gestire gli studenti
  getStudenti(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/studenti/`);
  }

  getStudentiByID(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/studenti/${id}`);
  }

  creaStudente(studente: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/studenti/`, studente);
  }

  eliminaStudente(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/studenti/${id}`);
  }

  aggiornaStudente(id: string, studente: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/studenti/${id}`, studente);
  }

  // Metodi per statistiche studenti
  getMediaStudente(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/studenti/media/${id}`);
  }

  getVotiAltiStudente(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/studenti/voti-alti/${id}`);
  }

  // Metodi per gestire i moduli da testare
  getModuli(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/modulo/`);
  }

  getModuloByID(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/modulo/${id}`);
  }

  creaModulo(modulo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/modulo/`, modulo);
  }

  eliminaModulo(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/modulo/${id}`);
  }

  aggiornaModulo(id: string, modulo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/modulo/${id}`, modulo);
  }
}
