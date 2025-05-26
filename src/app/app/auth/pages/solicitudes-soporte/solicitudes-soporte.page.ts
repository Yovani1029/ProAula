import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/app/core/services/usuario.service';
import { HttpClient } from '@angular/common/http';
import { LoadingController, AlertController } from '@ionic/angular';

interface TicketSoporte {
  id: number;
  asunto: string;
  mensaje: string;
  estado: string;
  fechaCreacion: string;
}

@Component({
  selector: 'app-solicitudes-soporte',
  templateUrl: './solicitudes-soporte.page.html',
  styleUrls: ['./solicitudes-soporte.page.scss'],
  standalone: false
})
export class SolicitudesSoportePage implements OnInit {
  tickets: TicketSoporte[] = [];
  usuarioId: number | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    const usuario = this.usuarioService.getUsuarioActual();
    this.usuarioId = usuario ? usuario.id : null;
    if (this.usuarioId) {
      this.cargarTickets();
    }
  }

  async cargarTickets() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando solicitudes...',
    });
    await loading.present();

    this.http.get<TicketSoporte[]>(`http://localhost:8080/api/tickets/usuario/${this.usuarioId}`)
      .subscribe({
        next: async (data) => {
          this.tickets = data;
          await loading.dismiss();
        },
        error: async (err) => {
          await loading.dismiss();
          const alert = await this.alertCtrl.create({
            header: 'Error',
            message: 'No se pudieron cargar las solicitudes de soporte.',
            buttons: ['OK'],
          });
          await alert.present();
        }
      });
  }
}
