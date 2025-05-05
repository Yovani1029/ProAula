import { Component } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { UsuarioService } from 'src/app/app/core/services/usuario.service'; 

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

  mostrarAcciones: boolean = false;
  mostrarConfiguracion: boolean = false;

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit() {
    const usuario = this.usuarioService.getUsuarioActual();
    if (usuario) {
      this.nombre = usuario.nombre;
      this.apellido = usuario.apellido;
      this.saldo = usuario.cuenta?.saldo || 0;
    } else {
      this.showToast('No se pudo cargar el usuario.');
    }
  }

  irATransferencia() {
    this.navCtrl.navigateForward('/transferencia');
  }

  irARetiro() {
    this.navCtrl.navigateForward('/retiro');
  }

  actualizar() {
    this.showToast('Función de actualizar no implementada aún.');
  }

  eliminar() {
    this.showToast('Función de eliminar no implementada aún.');
  }

  soporte() {
    this.navCtrl.navigateForward('/soporte');
  }

  logout() {
    this.usuarioService.limpiarUsuario();  // Limpiar la información del usuario
    this.navCtrl.navigateRoot('/login');  // Redirigir al login
  }

  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}
