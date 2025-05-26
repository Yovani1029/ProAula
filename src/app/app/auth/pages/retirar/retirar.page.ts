import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { RetiroService } from 'src/app/app/core/services/retiro.service';
import { UsuarioService } from 'src/app/app/core/services/usuario.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-retirar',
  templateUrl: './retirar.page.html',
  styleUrls: ['./retirar.page.scss'],
  standalone: false
})
export class RetirarPage implements OnInit {
  retiroForm!: FormGroup;
  step: number = 1;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private retiroService: RetiroService,
    private usuarioService: UsuarioService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    const telefonoGuardado = localStorage.getItem('telefono');
    if (!telefonoGuardado) {
      this.mostrarAlertaYRedirigir('Error', 'No se encontró el número del remitente');
      return;
    }

    this.retiroForm = this.fb.group({
      telefono: [{ value: telefonoGuardado, disabled: true }],
      monto: ['', [Validators.required, Validators.min(1)]],
      codigo: ['', [Validators.required]]
    });
  }

  async solicitarCodigo() {
    const telefono = this.retiroForm.get('telefono')?.value;
    if (!telefono) return;

    this.cargando = true;
    const loading = await this.loadingCtrl.create({
      message: 'Solicitando código...',
      spinner: 'crescent',
      translucent: true
    });
    await loading.present();

    try {
      await lastValueFrom(this.retiroService.solicitarCodigo(telefono));
      this.step = 2;
      await this.mostrarAlerta('Éxito', 'Código enviado a tu correo electrónico');
    } catch (error: any) {
      const errorMsg = error?.error?.message || error.message || 'Error al enviar el código';
      await this.mostrarAlerta('Error', errorMsg);
    } finally {
      this.cargando = false;
      await loading.dismiss();
    }
  }

  async realizarRetiro() {
    if (this.retiroForm.invalid || this.cargando) return;

    const telefono = this.retiroForm.get('telefono')?.value;
    const monto = this.retiroForm.get('monto')?.value;
    const codigo = this.retiroForm.get('codigo')?.value;

    this.cargando = true;
    const loading = await this.loadingCtrl.create({
      message: 'Procesando retiro...',
      spinner: 'crescent',
      translucent: true
    });
    await loading.present();

    try {
      const response = await lastValueFrom(this.retiroService.realizarRetiro(telefono, monto, codigo));

      const usuario = this.usuarioService.getUsuarioActual();
      if (usuario) {
        const nuevoSaldo = await lastValueFrom(this.usuarioService.getSaldo(usuario.id));
        this.usuarioService.setUsuarioActual({
          ...usuario,
          cuenta: { ...usuario.cuenta, saldo: nuevoSaldo ?? 0 }
        });
      }

      await this.mostrarAlertaYRedirigir('Retiro exitoso', `Nuevo saldo: $${response.nuevoSaldo}`);
    } catch (error: any) {
      const errorMsg = error?.error?.message || error.message || 'Error al realizar el retiro';
      await this.mostrarAlerta('Error', errorMsg);
    } finally {
      this.cargando = false;
      await loading.dismiss();
    }
  }

  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async mostrarAlertaYRedirigir(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.navigateRoot('/home');
        }
      }]
    });
    await alert.present();
  }
}
