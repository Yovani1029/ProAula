import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/app/core/services/usuario.service';

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  cuenta?: {
    saldo: number;
  };
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {
  nombre: string = '';
  apellido: string = '';
  saldo: number = 0;
  mostrarConfiguracion: boolean = false;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  private cargarDatosUsuario(): void {
    const usuario = this.usuarioService.getUsuarioActual();
    if (!usuario) {
      this.showToast('Debes iniciar sesión', 'warning');
      this.navCtrl.navigateRoot('/login');
      return;
    }
    this.nombre = usuario.nombre || '';
    this.apellido = usuario.apellido || '';
    this.saldo = usuario.cuenta?.saldo || 0;
  }

  // Navegación
  irATransferencia(): void {
    this.navCtrl.navigateForward('/transferencia');
  }

  irARetiro(): void {
    this.navCtrl.navigateForward('/retiro');
  }

  soporte(): void {
    this.navCtrl.navigateForward('/soporte');
  }

  // Acciones con confirmación
  async confirmLogout(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Salir', 
          handler: () => {
            this.logout();
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmarEliminar(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar cuenta',
      message: 'Esta acción es irreversible. ¿Continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { 
          text: 'Eliminar', 
          handler: () => {
            this.eliminar();
          }
        }
      ]
    });
    await alert.present();
  }

  // Lógica de operaciones
  private logout(): void {
    this.usuarioService.limpiarUsuario();
    this.navCtrl.navigateRoot('/login');
  }

  private eliminar(): void {
    // Lógica para eliminar cuenta (ej: llamada a API)
    this.showToast('Cuenta eliminada', 'success');
    this.logout();
  }

  actualizar(): void {
    // Lógica para actualizar datos
    this.showToast('Función en desarrollo', 'warning');
  }

  // Helpers
  private async showToast(
    message: string, 
    color: 'primary' | 'success' | 'warning' | 'danger' = 'primary'
  ): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}