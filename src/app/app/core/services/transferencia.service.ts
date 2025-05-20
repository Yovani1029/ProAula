import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TransferenciaService {

  private apiUrl = 'http://localhost:8080/api/transferencias/enviar';

  constructor(private http: HttpClient) {}

  enviarTransferencia(datos: any) {
    return this.http.post(this.apiUrl, datos, { responseType: 'text' });
  }
}
