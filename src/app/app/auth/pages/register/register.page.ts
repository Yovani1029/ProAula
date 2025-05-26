import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

function fechaNacimientoValidator(control: any) {
  const fecha = new Date(control.value);
  const hoy = new Date();

  if (fecha > hoy) return { fechaFutura: true };

  const edad = hoy.getFullYear() - fecha.getFullYear();
  const mes = hoy.getMonth() - fecha.getMonth();
  const dia = hoy.getDate() - fecha.getDate();
  const cumple15 = edad > 15 || (edad === 15 && (mes > 0 || (mes === 0 && dia >= 0)));

  if (!cumple15) return { menorDeEdad: true };

  return null;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  registerForm: FormGroup;
  emailValidationInProgress = false;
  private whitelistedDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'icloud.com'
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$')]],
      apellido: ['', [Validators.required, Validators.pattern('^[A-Za-zÁÉÍÓÚáéíóúÑñ]+$')]],
      tipoIdentificacion: ['', Validators.required],
      numeroIdentificacion: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      correo: ['', [Validators.required, Validators.email, this.emailValidator.bind(this)]],
      fechaNacimiento: ['', [Validators.required, fechaNacimientoValidator]],
      contrasena: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    });
  }

  emailValidator(control: any) {
    const email = control.value;
    if (!email) return null;

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      return { invalidFormat: true };
    }

    const domain = email.split('@')[1];
    if (this.whitelistedDomains.includes(domain)) {
      return null;
    }

    return null;
  }

  checkMaxLength(event: any, fieldName: string, maxLength: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    if (value.length > maxLength) {
      input.value = value.slice(0, maxLength);
      this.registerForm.get(fieldName)?.setValue(input.value);
    }
  }

  onlyNumbers(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  get fechaNacimientoErrors() {
    const control = this.registerForm.get('fechaNacimiento');
    return control?.touched && control?.errors;
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const emailControl = this.registerForm.get('correo');
    const email = emailControl?.value;

    if (emailControl?.hasError('email') || emailControl?.hasError('invalidFormat')) {
      return;
    }

    this.emailValidationInProgress = true;

    try {
      const domain = email.split('@')[1];
      if (this.whitelistedDomains.includes(domain)) {
        this.submitRegistration();
        return;
      }

      const apiKey = 'f5214d829db94b519b754409b9baaf1f';
      const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;
      
      const response: any = await this.http.get(url).toPromise();

      if (response.is_valid_format?.value === false || response.deliverability === 'UNDELIVERABLE') {
        emailControl?.setErrors({ correoInvalido: true });
        return;
      }

      this.submitRegistration();

    } catch (error: any) {
      console.error('Error validando correo:', error);
      this.submitRegistration(true);
    } finally {
      this.emailValidationInProgress = false;
    }
  }

  private submitRegistration(apiFailed: boolean = false) {
    this.http.post('http://localhost:8080/api/usuarios/registro', this.registerForm.value).subscribe({
      next: () => {
        alert('Registro exitoso' + (apiFailed ? ' (no se pudo verificar el correo)' : ''));
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Error en el registro: ' + err.error.message);
      }
    });
  }
}