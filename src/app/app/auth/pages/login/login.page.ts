import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NavController,
  ToastController,
  LoadingController,
} from '@ionic/angular';
import { AuthService } from 'src/app/app/core/services/auth.service';
import { UsuarioService } from 'src/app/app/core/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {
    this.loginForm = this.fb.group({
      telefono: ['', [Validators.required]],
      contrasena: ['', [Validators.required, Validators.pattern('^[0-9]{4}$')]],
    });
  }

  onPasswordInput(event: any) {
    const value: string = event.detail.value;
    if (value.length > 4) {
      this.loginForm
        .get('contrasena')
        ?.setValue(value.substring(0, 4), { emitEvent: false });
      this.showToast('La contraseña debe tener solo 4 dígitos.');
    }
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.showToast('Por favor, completa los campos correctamente.');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    const { telefono, contrasena } = this.loginForm.value;

    this.authService.login(telefono, contrasena).subscribe({
      next: async (usuario) => {
        await loading.dismiss();
        if (usuario) {
          this.usuarioService.setUsuarioActual(usuario);

          localStorage.setItem('idUsuario', usuario.id.toString());

          localStorage.setItem('telefono', usuario.telefono);

          this.showToast(
            `Bienvenido ${usuario.nombre} ${usuario.apellido}`,
            'success'
          );
          this.navCtrl.navigateRoot('/home');
        } else {
          this.showToast('Teléfono o contraseña incorrectos.');
        }
      },
      error: async () => {
        await loading.dismiss();
        this.showToast('Error de conexión con el servidor.');
      },
    });
  }

  async showToast(message: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
    });
    toast.present();
  }
}
