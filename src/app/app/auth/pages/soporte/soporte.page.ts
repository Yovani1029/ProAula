import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController } from '@ionic/angular';
import { UsuarioService } from 'src/app/app/core/services/usuario.service';

@Component({
  selector: 'app-soporte',
  templateUrl: './soporte.page.html',
  styleUrls: ['./soporte.page.scss'],
  standalone: false
})
export class SoportePage implements OnInit {
  ticketForm: FormGroup;
  enviando = false;
  usuario: any = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private usuarioService: UsuarioService
  ) {
    this.ticketForm = this.fb.group({
      asunto: ['', [Validators.required,]],
      mensaje: ['', [Validators.required,]],
      nombreContacto: ['', Validators.required],
      correoContacto: ['', [Validators.required, Validators.email]],
      usuarioId: [null]
    });
  }

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  async cargarDatosUsuario() {
    this.usuario = this.usuarioService.getUsuarioActual();

    if (this.usuario) {
      this.ticketForm.patchValue({
        nombreContacto: this.usuario.nombre || '',
        correoContacto: this.usuario.email || this.usuario.correo || '', // Usa el campo que corresponda
        usuarioId: this.usuario.id
      });
    }
  }

  async enviarTicket() {
    if (this.ticketForm.invalid) {
      await this.mostrarAlerta('Formulario incompleto', 'Por favor completa todos los campos requeridos');
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Enviando ticket...',
      spinner: 'crescent'
    });
    await loading.present();
    this.enviando = true;

    try {
      const response: any = await this.http.post(
        'http://localhost:8080/api/tickets',
        this.ticketForm.value
      ).toPromise();

      await this.mostrarAlerta(
        '¡Éxito!',
        `Ticket #${response.id} creado correctamente.` +
        `\nTe contactaremos a: ${this.ticketForm.value.correoContacto}`
      );

      this.ticketForm.reset();
      if (this.usuario) this.cargarDatosUsuario();

    } catch (error: any) {
      console.error('Error al enviar ticket:', error);
      const mensajeError = error.error?.message ||
        error.message ||
        'Error desconocido al enviar el ticket';

      await this.mostrarAlerta('Error', mensajeError);
    } finally {
      this.enviando = false;
      await loading.dismiss();
    }
  }

  private async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }
}