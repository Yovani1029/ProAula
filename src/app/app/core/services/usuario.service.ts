import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Usuario {
  id: number;
  nombre?: string;
  apellido?: string;
  cuenta?: {
    saldo: number;
  };
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = 'http://localhost:8080/api/usuario';
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

  limpiarUsuario(): void {
    this.usuarioActual = null;
    localStorage.removeItem('usuario');
  }

  getUsuario(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener usuario:', error);
        return throwError(() => new Error('Error en la solicitud'));
      })
    );
  }

  getSaldo(idUsuario: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/cuentas/${idUsuario}/saldo`).pipe(
      catchError((error) => {
        console.error('Error al obtener saldo:', error);
        return throwError(() => new Error('Error en la solicitud'));
      })
    );
  }
}