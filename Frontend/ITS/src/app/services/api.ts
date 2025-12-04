import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private apiUrl = 'http://127.0.0.1:5000'; // URL della tua API Flask

  constructor(private http: HttpClient) {}

  getDati(): Observable<any> {
    return this.http.get(`${this.apiUrl}/dati`);
  }

  postData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/route`, data);
  }
}
