import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Usuario {
  id: number;
  nombre?: string;
  apellido?: string;
  email?: string; // este reemplaza "email" si el backend usa "correo"
  telefono?: string;
  fechaNacimiento?: string; // ISO string (ej: '2025-05-23')
  tipoIdentificacion?: string;
  numeroIdentificacion?: string;
  contrasena?: string;
  cuenta?: { saldo: number };
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuarios';
  private usuarioActual: Usuario | null = null;

  constructor(private http: HttpClient) {}

  setUsuarioActual(usuario: Usuario): void {
    this.usuarioActual = usuario;
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuarioActual(): Usuario | null {
    if (this.usuarioActual) return this.usuarioActual;

    const usuario = localStorage.getItem('usuario');
    this.usuarioActual = usuario ? JSON.parse(usuario) : null;
    return this.usuarioActual;
  }

  actualizarUsuario(id: number, datos: any) {
    return this.http.put(`${this.apiUrl}/${id}`, datos); // ✅ Esto sí funciona
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  limpiarUsuario(): void {
    this.usuarioActual = null;
    localStorage.removeItem('usuario');
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener usuario:', error.status, error.error);
        return throwError(() => new Error('Error en la solicitud'));
      })
    );
  }

  getSaldo(idUsuario: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${idUsuario}/saldo`).pipe(
      catchError((error) => {
        console.error('Error al obtener saldo:', error);
        return throwError(() => new Error('Error en la solicitud'));
      })
    );
  }

  getMovimientos(cuentaId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/cuentas/${cuentaId}/movimientos`
    );
  }
}
