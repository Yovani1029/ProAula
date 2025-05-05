import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuario';
  private usuarioActual: any = null;

  constructor(private http: HttpClient) {}

  setUsuarioActual(usuario: any): void {
    this.usuarioActual = usuario;
  }

  getUsuarioActual(): any {
    if (!this.usuarioActual) {
      const id = localStorage.getItem('idUsuario');
      if (id) {
        this.usuarioActual = { id: +id };
      }
    }
    return this.usuarioActual;
  }
  limpiarUsuario(): void {
    this.usuarioActual = null;
    localStorage.removeItem('idUsuario');
  }
  getUsuario(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios/${id}`);
  }
  getSaldo(idUsuario: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/cuentas/${idUsuario}/saldo`);
  }
}
