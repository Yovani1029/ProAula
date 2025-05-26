import { Component, OnInit } from '@angular/core';
import { FacturaService } from 'src/app/app/core/services/factura.service';
import { UsuarioService } from 'src/app/app/core/services/usuario.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-pagar-factura',
  templateUrl: './pagar-factura.page.html',
})
export class PagarFacturaPage implements OnInit {
  facturasPendientes: any[] = [];
  saldoCuenta: number = 0;
  cargando = false;

  constructor(
    private facturaService: FacturaService,
    private usuarioService: UsuarioService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.obtenerFacturasPendientes();
    this.obtenerSaldoCuenta();
  }

  obtenerFacturasPendientes() {
    this.facturaService.getFacturasPendientes().subscribe((data) => {
      this.facturasPendientes = data;
    });
  }

  obtenerSaldoCuenta() {
    const usuario = this.usuarioService.getUsuarioActual();
    if (usuario?.cuenta?.saldo != null) {
      this.saldoCuenta = usuario.cuenta.saldo;
    }
  }

  async pagarFactura(factura: any) {
    if (this.cargando) return;

    if (factura.monto > this.saldoCuenta) {
      this.mostrarToast('Saldo insuficiente para pagar esta factura', 'danger');
      return;
    }

    const alertConfirm = await this.alertCtrl.create({
      header: 'Confirmar Pago',
      message: `¿Deseas pagar la factura de ${factura.servicio} por $${factura.monto}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Pagar',
          handler: () => this.procesarPago(factura),
        },
      ],
    });
    await alertConfirm.present();
  }

  private async procesarPago(factura: any) {
    this.cargando = true;
    const loading = await this.loadingCtrl.create({
      message: 'Procesando pago...',
      spinner: 'crescent',
      translucent: true,
    });
    await loading.present();

    try {
      await this.facturaService.pagarFactura(factura.id).toPromise();

      const usuario = this.usuarioService.getUsuarioActual();
      if (usuario && usuario.cuenta) {
        const nuevoSaldo = usuario.cuenta.saldo - factura.monto;
        this.usuarioService.setUsuarioActual({
          ...usuario,
          cuenta: { ...usuario.cuenta, saldo: nuevoSaldo },
        });
        this.saldoCuenta = nuevoSaldo;
      }

      this.mostrarToast('Factura pagada exitosamente', 'success');
      this.obtenerFacturasPendientes();

    } catch (error) {
      console.error('Error al pagar factura:', error);
      this.mostrarToast('Error al pagar la factura', 'danger');
    } finally {
      this.cargando = false;
      await loading.dismiss();
    }
  }


  async mostrarToast(msg: string, color: 'success' | 'danger' = 'success') {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color,
    });
    toast.present();
  }
}
