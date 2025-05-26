import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DepositoService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  depositar(telefono: string, monto: number): Observable<any> {
    const request = {
      telefono: telefono,
      monto: monto
    };

    return this.http.post(`${this.apiUrl}/depositos`, request).pipe(
      catchError(error => {
        console.error('Error en la solicitud:', error);
        
        if (error.status === 0) {
          return throwError(() => 'Error de conexión con el servidor');
        } else if (error.error && typeof error.error === 'string') {
          return throwError(() => error.error);
        } else if (error.message) {
          return throwError(() => error.message);
        } else {
          return throwError(() => 'Error desconocido al procesar el depósito');
        }
      })
    );
  }
}