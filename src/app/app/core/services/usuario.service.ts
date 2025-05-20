import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Usuario {
  id: number;
  nombre?: string;
  apellido?: string;
<<<<<<< HEAD
  cuenta?: {
    saldo: number;
=======
  cuenta?: {    saldo: number;
>>>>>>> 6a04252 (nuevo commit)
  };
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
<<<<<<< HEAD
  private apiUrl = 'http://localhost:8080/api/usuario';
=======
  private apiUrl = 'http://localhost:8080/api/usuarios';
>>>>>>> 6a04252 (nuevo commit)
  private usuarioActual: Usuario | null = null;

  constructor(private http: HttpClient) {}

  setUsuarioActual(usuario: Usuario): void {
    this.usuarioActual = usuario;
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuarioActual(): Usuario | null {
    if (this.usuarioActual) return this.usuarioActual;
<<<<<<< HEAD
    
=======

>>>>>>> 6a04252 (nuevo commit)
    const usuario = localStorage.getItem('usuario');
    this.usuarioActual = usuario ? JSON.parse(usuario) : null;
    return this.usuarioActual;
  }

  limpiarUsuario(): void {
    this.usuarioActual = null;
    localStorage.removeItem('usuario');
  }

  getUsuario(id: number): Observable<Usuario> {
<<<<<<< HEAD
    return this.http.get<Usuario>(`${this.apiUrl}/usuarios/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener usuario:', error);
=======
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al obtener usuario:', error.status, error.error);
>>>>>>> 6a04252 (nuevo commit)
        return throwError(() => new Error('Error en la solicitud'));
      })
    );
  }

  getSaldo(idUsuario: number): Observable<number> {
<<<<<<< HEAD
    return this.http.get<number>(`${this.apiUrl}/cuentas/${idUsuario}/saldo`).pipe(
=======
    return this.http.get<number>(`${this.apiUrl}/${idUsuario}/saldo`).pipe(
>>>>>>> 6a04252 (nuevo commit)
      catchError((error) => {
        console.error('Error al obtener saldo:', error);
        return throwError(() => new Error('Error en la solicitud'));
      })
    );
  }
<<<<<<< HEAD
}
=======

  getMovimientos(cuentaId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/cuentas/${cuentaId}/movimientos`);
}

}
>>>>>>> 6a04252 (nuevo commit)
