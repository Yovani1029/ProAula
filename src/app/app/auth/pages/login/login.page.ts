import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      telefono: ['', [Validators.required]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onSubmit() {
    if (this.loginForm.invalid) {
      this.showToast('Por favor, completa los campos correctamente.');
      return;
    }

    const loading = await this.loadingCtrl.create({ message: 'Iniciando sesión...' });
    await loading.present();

    const { telefono, contrasena } = this.loginForm.value;

    this.authService.login(telefono, contrasena).subscribe({
      next: async (usuario) => {
        await loading.dismiss();
        if (usuario) {
          this.showToast(`Bienvenido ${usuario.nombre} ${usuario.apellido}`, 'success');
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
      duration: 3000,
      position: 'bottom',
      color,
    });
    toast.present();
  }
}
