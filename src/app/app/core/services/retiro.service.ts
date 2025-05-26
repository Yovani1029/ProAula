import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

interface RetiroResponse {
    exito: boolean;
    mensaje: string;
    telefono: string;
    montoRetirado: number;
    nuevoSaldo: number;
}

@Injectable({
    providedIn: 'root'
})
export class RetiroService {
    private apiUrl = 'http://localhost:8080/api/retiros';

    constructor(private http: HttpClient) { }

    solicitarCodigo(telefono: string): Observable<any> {
        if (!telefono || telefono.trim().length === 0) {
            return throwError(() => new Error('El teléfono es requerido'));
        }

        return this.http.post(`${this.apiUrl}/solicitar-codigo`, { telefono })
            .pipe(
                catchError(this.handleError)
            );
    }

    realizarRetiro(telefono: string, monto: number, codigo: string): Observable<RetiroResponse> {
        if (!telefono || !codigo || !monto) {
            return throwError(() => new Error('Todos los campos son requeridos'));
        }

        if (monto <= 0) {
            return throwError(() => new Error('El monto debe ser mayor que cero'));
        }

        return this.http.post<RetiroResponse>(`${this.apiUrl}/realizar`, {
            telefono,
            monto,
            codigo
        }).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Ocurrió un error desconocido';

        if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
        } else {
            errorMessage = error.error?.message || error.message;
        }

        return throwError(() => new Error(errorMessage));
    }
}