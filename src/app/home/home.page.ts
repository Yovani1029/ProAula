import { Component } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { UsuarioService } from 'src/app/app/core/services/usuario.service';
<<<<<<< HEAD

interface Usuario {
=======
import { TransaccionService, Transaccion } from 'src/app/app/core/services/transaccion.service';

interface UsuarioConCuentaId {
>>>>>>> 6a04252 (nuevo commit)
  id: number;
  nombre: string;
  apellido: string;
  cuenta?: {
<<<<<<< HEAD
=======
    id: number;
>>>>>>> 6a04252 (nuevo commit)
    saldo: number;
  };
}

<<<<<<< HEAD
=======

>>>>>>> 6a04252 (nuevo commit)
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {
<<<<<<< HEAD
  nombre: string = '';
  apellido: string = '';
  saldo: number = 0;
  mostrarConfiguracion: boolean = false;
=======
  nombre = '';
  apellido = '';
  saldo = 0;
  mostrarConfiguracion = false;
  movimientos: Transaccion[] = [];
  segmento: 'servicios' | 'movimientos' = 'servicios';
>>>>>>> 6a04252 (nuevo commit)

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
<<<<<<< HEAD
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  private cargarDatosUsuario(): void {
    const usuario = this.usuarioService.getUsuarioActual();
    if (!usuario) {
=======
    private usuarioService: UsuarioService,
    private transaccionService: TransaccionService
  ) { }

  ionViewWillEnter() {
    this.cargarDatosUsuario();
  }


  private cargarDatosUsuario(): void {
    const usuario = this.usuarioService.getUsuarioActual() as UsuarioConCuentaId;
    this.cargarTransacciones(usuario.cuenta?.id ?? 0);

    if (!usuario || !usuario.cuenta) {
>>>>>>> 6a04252 (nuevo commit)
      this.showToast('Debes iniciar sesión', 'warning');
      this.navCtrl.navigateRoot('/login');
      return;
    }
<<<<<<< HEAD
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
=======
    this.nombre = usuario.nombre ?? '';
    this.apellido = usuario.apellido ?? '';
    this.saldo = usuario.cuenta.saldo ?? 0;
    this.cargarTransacciones(usuario.cuenta.id);
  }



  private cargarTransacciones(cuentaId: number) {
    this.transaccionService.obtenerTransaccionesPorCuenta(cuentaId).subscribe({
      next: data => this.movimientos = data,
      error: () => this.showToast('Error al cargar movimientos', 'danger')
    });
  }

  cambioSegmento(event: CustomEvent) {
    this.segmento = event.detail.value;
  }

  irATransferencia() { this.navCtrl.navigateForward('/transferencia'); }
  irARetiro() { this.navCtrl.navigateForward('/retiro'); }
  soporte() { this.navCtrl.navigateForward('/soporte'); }

  async confirmLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Salir', handler: () => this.logout() }
>>>>>>> 6a04252 (nuevo commit)
      ]
    });
    await alert.present();
  }

<<<<<<< HEAD
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
=======
  private logout() {
>>>>>>> 6a04252 (nuevo commit)
    this.usuarioService.limpiarUsuario();
    this.navCtrl.navigateRoot('/login');
  }

<<<<<<< HEAD
  private eliminar(): void {
    // Lógica para eliminar cuenta (ej: llamada a API)
=======
  async confirmarEliminar() {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar cuenta',
      message: 'Esta acción es irreversible. ¿Deseas continuar?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', handler: () => this.eliminar() }
      ]
    });
    await alert.present();
  }

  private eliminar() {
>>>>>>> 6a04252 (nuevo commit)
    this.showToast('Cuenta eliminada', 'success');
    this.logout();
  }

<<<<<<< HEAD
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
=======
  actualizar() {
    this.showToast('Función en desarrollo', 'warning');
  }

  private async showToast(
    message: string,
    color: 'primary' | 'success' | 'warning' | 'danger' = 'primary'
  ) {
    const toast = await this.toastCtrl.create({ message, duration: 2000, color });
    await toast.present();
  }
}
>>>>>>> 6a04252 (nuevo commit)
