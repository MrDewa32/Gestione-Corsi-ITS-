import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private apiUrl = 'http://127.0.0.1:5000'; 

  constructor(private http: HttpClient) {}

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
}
