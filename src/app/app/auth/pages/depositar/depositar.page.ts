import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { finalize, lastValueFrom } from 'rxjs';
import { DepositoService } from 'src/app/app/core/services/deposito.service';
import { UsuarioService } from 'src/app/app/core/services/usuario.service';

@Component({
  selector: 'app-depositar',
  templateUrl: './depositar.page.html',
  styleUrls: ['./depositar.page.scss'],
  standalone: false
})

export class DepositarPage implements OnInit {
  depositoForm!: FormGroup;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private depositoService: DepositoService,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    const telefonoGuardado = localStorage.getItem('telefono');

    if (!telefonoGuardado) {
      this.mostrarAlertaYRedirigir('Error', 'No se encontró el número del remitente');
      return;
    }

    this.depositoForm = this.fb.group({
      telefono: [{ value: telefonoGuardado, disabled: true }],
      monto: ['', [Validators.required, Validators.min(1)]],
    });
  }

  async realizarDeposito() {
    if (this.depositoForm.invalid || this.cargando) return;

    this.cargando = true;
    const loading = await this.loadingCtrl.create({
      message: 'Procesando depósito...',
      spinner: 'crescent',
      translucent: true
    });
    await loading.present();

    const telefono = this.depositoForm.get('telefono')?.value;
    const monto = this.depositoForm.get('monto')?.value;

    try {
      const resultado = await lastValueFrom(
        this.depositoService.depositar(telefono, monto)
      );

      const usuario = this.usuarioService.getUsuarioActual();
      if (usuario) {
        const nuevoSaldo = await lastValueFrom(
          this.usuarioService.getSaldo(usuario.id)
        );
        this.usuarioService.setUsuarioActual({
          ...usuario,
          cuenta: { ...usuario.cuenta, saldo: nuevoSaldo ?? 0 }
        });
      }

      await this.mostrarAlertaYRedirigir(
        'Éxito', 
        'Depósito realizado correctamente'
      );
      
      this.depositoForm.get('monto')?.reset();

    } catch (error) {
      console.error('Error en depósito:', error);
      let mensajeError = 'No se pudo completar el depósito';

      if (typeof error === 'string') {
        mensajeError = error;
      } else if (error instanceof Error) {
        mensajeError = error.message;
      }

      await this.mostrarAlerta('Error', mensajeError);
    } finally {
      this.cargando = false;
      await loading.dismiss();
    }
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

  private async mostrarAlerta(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}