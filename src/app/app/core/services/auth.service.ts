import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  telefono: string;
  correo: string;
  fechaNacimiento: string;
  contrasena: string;
}


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  login(telefono: string, contrasena: string): Observable<Usuario | null> {
    const body = { telefono, contrasena };
    return this.http.post<Usuario | null>(`${this.apiUrl}/login`, body);
  }
}
