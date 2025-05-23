import { Component, OnInit } from '@angular/core';
import { FacturaService } from 'src/app/app/core/services/factura.service';
import { AlertController, ToastController } from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-pagar-factura',
  templateUrl: './pagar-factura.page.html',
})
export class PagarFacturaPage implements OnInit {
  facturasPendientes: any[] = [];

  constructor(
    private facturaService: FacturaService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.obtenerFacturasPendientes();
  }

  obtenerFacturasPendientes() {
    this.facturaService.getFacturasPendientes().subscribe((data) => {
      this.facturasPendientes = data;
    });
  }

  async pagarFactura(factura: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Pago',
      message: `¿Deseas pagar la factura de ${factura.servicio}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Pagar',
          handler: () => {
            this.facturaService.pagarFactura(factura.id).subscribe(() => {
              this.mostrarToast('Factura pagada exitosamente');
              this.obtenerFacturasPendientes();
            });
          },
        },
      ],
    });
    await alert.present();
  }

  async mostrarToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: 'success',
    });
    toast.present();
  }
}
