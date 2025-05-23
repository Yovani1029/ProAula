import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  UsuarioService,
  Usuario,
} from 'src/app/app/core/services/usuario.service';
import {
  AlertController,
  NavController,
  ToastController,
} from '@ionic/angular';

@Component({
  standalone: false,
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.page.html',
  styleUrls: ['./editar-usuario.page.scss'],
})
export class EditarUsuarioPage implements OnInit {
  usuarioForm!: FormGroup;
  usuario!: Usuario;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    const usuario = this.usuarioService.getUsuarioActual();
    if (!usuario) {
      this.showToast('No hay usuario cargado', 'danger');
      return;
    }

    this.usuario = usuario;

    this.usuarioForm = this.fb.group({
      nombre: [usuario.nombre || '', Validators.required],
      apellido: [usuario.apellido || '', Validators.required],
      correo: [usuario.email || '', [Validators.required, Validators.email]],
      telefono: [usuario.telefono || '', Validators.required],
      fechaNacimiento: [usuario.fechaNacimiento || '', Validators.required],
      tipoIdentificacion: [
        usuario.tipoIdentificacion || '',
        Validators.required,
      ],
      numeroIdentificacion: [
        usuario.numeroIdentificacion || '',
        Validators.required,
      ],
      contrasena: ['', Validators.maxLength(4)],
    });
  }

  guardarCambios() {
    if (this.usuarioForm.invalid) {
      this.showToast('Formulario inválido', 'warning');
      return;
    }

    const datosActualizados = {
      id: this.usuario.id,
      nombre: this.usuarioForm.value.nombre,
      apellido: this.usuarioForm.value.apellido,
      correo: this.usuarioForm.value.correo,
      telefono: this.usuarioForm.value.telefono,
      fechaNacimiento: this.usuarioForm.value.fechaNacimiento,
      tipoIdentificacion: this.usuarioForm.value.tipoIdentificacion,
      numeroIdentificacion: this.usuarioForm.value.numeroIdentificacion,
      contrasena: this.usuarioForm.value.contrasena,
    };

    this.usuarioService
      .actualizarUsuario(this.usuario.id, datosActualizados)
      .subscribe({
        next: async () => {
          // Limpia el usuario actual (opcional pero recomendado)

          // Muestra alerta
          const alert = await this.alertCtrl.create({
            header: 'Actualización exitosa',
            message:
              'Tus datos han sido actualizados correctamente. Por favor vuelve a iniciar sesión.',
            buttons: [
              {
                text: 'OK',
                handler: () => {
                  this.navCtrl.navigateRoot('/login');
                },
              },
            ],
          });

          await alert.present();
        },
        error: () => {
          this.showToast('Error al actualizar', 'danger');
        },
      });
  }

  cancelar() {
    this.navCtrl.navigateBack('/home');
  }

  private async showToast(
    message: string,
    color: 'primary' | 'success' | 'warning' | 'danger'
  ) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
    });
    await toast.present();
  }
}
