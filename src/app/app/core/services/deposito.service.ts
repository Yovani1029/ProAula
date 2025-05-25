import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DepositoService {
  private apiUrl = 'http://localhost:8080/api'; // Ajusta tu URL

  constructor(private http: HttpClient) { }

  depositar(telefono: string, monto: number): Observable<any> {
    const request = {
      telefono: telefono,
      monto: monto
    };

    return this.http.post(`${this.apiUrl}/depositos`, request).pipe(
      catchError(error => {
        console.error('Error en la solicitud:', error);
        
        // Manejo mejorado de errores
        if (error.status === 0) {
          // Error de conexión
          return throwError(() => 'Error de conexión con el servidor');
        } else if (error.error && typeof error.error === 'string') {
          // Error del servidor (mensaje directo)
          return throwError(() => error.error);
        } else if (error.message) {
          // Error de JavaScript
          return throwError(() => error.message);
        } else {
          // Error desconocido
          return throwError(() => 'Error desconocido al procesar el depósito');
        }
      })
    );
  }
}