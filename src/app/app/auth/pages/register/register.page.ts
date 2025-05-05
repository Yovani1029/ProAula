import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

// Función de validación personalizada para la fecha de nacimiento
function fechaNacimientoValidator(control: AbstractControl): ValidationErrors | null {
  const fecha = new Date(control.value);
  const hoy = new Date();

  if (fecha > hoy) {
    return { fechaFutura: true }; // Si la fecha es futura
  }

  // Validar que tenga al menos 15 años
  const edad = hoy.getFullYear() - fecha.getFullYear();
  const mes = hoy.getMonth() - fecha.getMonth();
  const dia = hoy.getDate() - fecha.getDate();
  const cumple15 = edad > 15 || (edad === 15 && (mes > 0 || (mes === 0 && dia >= 0)));

  if (!cumple15) {
    return { menorDeEdad: true }; // Si tiene menos de 15 años
  }

  return null;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  standalone: false
})
export class RegisterPage {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$')]], // Validación solo letras
      apellido: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$')]], // Validación solo letras
      tipoIdentificacion: ['', Validators.required],
      numeroIdentificacion: ['', [Validators.required, Validators.pattern('^[0-9]+$')]], // Validación solo números
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]], // Validación de teléfono
      correo: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', [Validators.required, fechaNacimientoValidator]], // Validación de fecha de nacimiento
      contrasena: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]], // Contraseña de 4 dígitos numéricos
    });
  }

  get telefonoInvalid() {
    const control = this.registerForm.get('telefono');
    return control?.touched && control?.invalid;
  }

  get contrasenaInvalid() {
    const control = this.registerForm.get('contrasena');
    return control?.touched && control?.invalid;
  }

  get fechaNacimientoErrors() {
    const control = this.registerForm.get('fechaNacimiento');
    return control?.touched && control?.errors;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.http.post('http://localhost:8080/api/usuarios/registro', this.registerForm.value).subscribe({
        next: () => {
          alert('Registro exitoso');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          alert('Error en el registro: ' + err.error.message);
        }
      });
    }
  }
}
