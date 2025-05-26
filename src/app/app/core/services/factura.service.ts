import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Factura {
  id?: number;
  servicio: string; // "agua", "luz", "internet"
  idServicio: string;
  monto: number;
  estado: 'pendiente' | 'pagada' | string;
  fechaEmision: string;
  fechaLimite: string;
}

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private apiUrl = 'http://localhost:8080/api/facturas';

  constructor(private http: HttpClient) {}

  getFacturas(usuarioId: number): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  crearFactura(usuarioId: number, factura: Factura): Observable<Factura> {
    return this.http.post<Factura>(
      `${this.apiUrl}/usuario/${usuarioId}`,
      factura
    );
  }

  actualizarFactura(id: number, factura: Factura): Observable<Factura> {
    return this.http.put<Factura>(`${this.apiUrl}/${id}`, factura);
  }

  eliminarFactura(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFacturasPendientes(): Observable<Factura[]> {
    return this.http.get<Factura[]>(`${this.apiUrl}/pendientes`);
  }

  pagarFactura(id: number): Observable<Factura> {
    return this.http.put<Factura>(`${this.apiUrl}/${id}/pagar`, {});
  }
}
