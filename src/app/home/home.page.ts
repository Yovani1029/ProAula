import { Component } from '@angular/core';
import {
  NavController,
  ToastController,
  AlertController,
} from '@ionic/angular';
import { UsuarioService } from 'src/app/app/core/services/usuario.service';
import {
  TransaccionService,
  Transaccion,
} from 'src/app/app/core/services/transaccion.service';
import { Router } from '@angular/router';
interface UsuarioConCuentaId {
  id: number;
  nombre: string;
  apellido: string;
  cuenta?: {
    id: number;
    saldo: number;
  };
}
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage {
  nombre = '';
  apellido = '';
  saldo = 0;
  mostrarConfiguracion = false;
  movimientos: Transaccion[] = [];
  segmento: 'servicios' | 'movimientos' = 'servicios';

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,

    private usuarioService: UsuarioService,
    private transaccionService: TransaccionService
  ) {}

  ionViewWillEnter() {
    this.cargarDatosUsuario();
  }

  private cargarDatosUsuario(): void {
    const usuario =
      this.usuarioService.getUsuarioActual() as UsuarioConCuentaId;
    this.cargarTransacciones(usuario.cuenta?.id ?? 0);

    if (!usuario || !usuario.cuenta) {
      this.showToast('Debes iniciar sesión', 'warning');
      this.navCtrl.navigateRoot('/login');
      return;
    }

    this.nombre = usuario.nombre ?? '';
    this.apellido = usuario.apellido ?? '';
    this.saldo = usuario.cuenta.saldo ?? 0;
    this.cargarTransacciones(usuario.cuenta.id);
  }

  private cargarTransacciones(cuentaId: number) {
    this.transaccionService.obtenerTransaccionesPorCuenta(cuentaId).subscribe({
      next: (data) => (this.movimientos = data),
      error: () => this.showToast('Error al cargar movimientos', 'danger'),
    });
  }

  cambioSegmento(event: CustomEvent) {
    this.segmento = event.detail.value;
  }
  irAFacturas() {
    this.router.navigate(['/factura']);
  }
  irATransferencia() {
    this.navCtrl.navigateForward('/transferencia');
  }
  irARetiro() {
    this.navCtrl.navigateForward('/retiro');
  }
  soporte() {
    this.navCtrl.navigateForward('/soporte');
  }

  async confirmLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Salir', handler: () => this.logout() },
      ],
    });
    await alert.present();
  }

  private logout() {
    this.usuarioService.limpiarUsuario();
    this.navCtrl.navigateRoot('/login');
  }

  async confirmarEliminar() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar cuenta',
      message: 'Esta acción es irreversible. ¿Deseas continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => this.eliminar() },
      ],
    });
    await alert.present();
  }

  private eliminar() {
    const usuario =
      this.usuarioService.getUsuarioActual() as UsuarioConCuentaId;
    if (!usuario || !usuario.id) {
      this.showToast('Error al eliminar usuario', 'danger');
      return;
    }

    this.usuarioService.eliminarUsuario(usuario.id).subscribe({
      next: () => {
        this.showToast('Cuenta eliminada', 'success');
        this.logout();
      },
      error: () => {
        this.showToast('Error al eliminar la cuenta', 'danger');
      },
    });
  }

  actualizar() {
    this.navCtrl.navigateForward('/editar-usuario');
  }

  private async showToast(
    message: string,
    color: 'primary' | 'success' | 'warning' | 'danger' = 'primary'
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
    });
    await toast.present();
  }
}
