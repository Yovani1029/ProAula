import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Transaccion {
    transaccionId: number;
    monto: number;
    tipoTransaccion: string;
    descripcion: string;
    fechaTransaccion: string;
    estado: string;
}



@Injectable({
    providedIn: 'root'
})
export class TransaccionService {
    private apiUrl = 'http://localhost:8080/api/transacciones';

    constructor(private http: HttpClient) { }

    obtenerTransaccionesPorCuenta(cuentaId: number): Observable<Transaccion[]> {
        return this.http.get<Transaccion[]>(`${this.apiUrl}/cuenta/${cuentaId}`);
    }
}
