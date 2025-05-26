import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TransferenciaService } from 'src/app/app/core/services/transferencia.service';
import { AlertController, NavController } from '@ionic/angular';
import { UsuarioService } from 'src/app/app/core/services/usuario.service';

@Component({
  selector: 'app-transferencia',
  templateUrl: './transferencia.page.html',
  styleUrls: ['./transferencia.page.scss'],
  standalone: false
})
export class TransferenciaPage implements OnInit {

  transferenciaForm!: FormGroup;
  telefonoRemitente: string = '';

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private transferenciaService: TransferenciaService,
    private alertCtrl: AlertController,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit() {
    const telefonoGuardado = localStorage.getItem('telefono');
    if (!telefonoGuardado) {
      this.showAlert('Error', 'No se encontró el número del remitente');
      return;
    }

    this.telefonoRemitente = telefonoGuardado;

    this.transferenciaForm = this.fb.group({
      telefonoRemitente: [{ value: this.telefonoRemitente, disabled: true }, [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      telefonoDestinatario: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      monto: ['', [
        Validators.required,
        Validators.min(1)
      ]]
    });
  }

  async confirmarTransferencia() {
    if (this.transferenciaForm.invalid) {
      this.transferenciaForm.markAllAsTouched();
      return;
    }

    const form = this.transferenciaForm.getRawValue();

    const alert = await this.alertCtrl.create({
      header: 'Confirmar transferencia',
      message:
        'Estas Seguro De Enviar\n\n' + `$${form.monto}\n\n` +
        `A ${form.telefonoDestinatario}\n`
      ,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar',
          handler: () => this.enviar()
        }
      ]
    });

    await alert.present();
  }

  async enviar() {
    if (this.transferenciaForm.invalid) {
      this.transferenciaForm.markAllAsTouched();
      return;
    }

    const form = {
      telefonoRemitente: this.telefonoRemitente,
      ...this.transferenciaForm.getRawValue()
    };

    try {
      const mensaje = await this.transferenciaService.enviarTransferencia(form).toPromise();

      const usuario = this.usuarioService.getUsuarioActual();
      if (usuario) {
        const nuevoSaldo = (await this.usuarioService.getSaldo(usuario.id).toPromise()) ?? 0;
        this.usuarioService.setUsuarioActual({
          ...usuario,
          cuenta: {
            ...usuario.cuenta,
            saldo: nuevoSaldo
          }
        });

      }

      this.showAlert('Éxito', mensaje as string);
      this.transferenciaForm.reset();
      this.navCtrl.navigateRoot('/home');

    } catch (error) {
      let mensajeError = 'Ocurrió un error';

      if (error instanceof Error) {
        mensajeError = error.message;
      } else if (typeof error === 'object' && error !== null && 'error' in error) {
        mensajeError = (error as any).error;
      }

      this.showAlert('Error', mensajeError);
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
