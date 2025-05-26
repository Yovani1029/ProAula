import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FacturaService } from 'src/app/app/core/services/factura.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-registrar-factura',
  templateUrl: './registrar-factura.page.html',
  styleUrls: ['./registrar-factura.page.scss'],
})
export class RegistrarFacturaPage implements OnInit {
  formFactura: FormGroup;
  servicioId: number | null = null;
  servicio: string = '';

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private route: ActivatedRoute
  ) {
    this.formFactura = this.fb.group({
      servicio: ['', Validators.required],
      nic: [''], // para luz
      id_agua: [''], // para agua
      id_internet: [''], // para internet
    });
  }

  ngOnInit() {
    this.servicioId = Number(this.route.snapshot.paramMap.get('id_servicio'));
    this.servicio = this.route.snapshot.paramMap.get('categoria') || '';
  }

  registrarFactura() {
    const usuarioId = Number(localStorage.getItem('idUsuario'));

    if (!usuarioId || isNaN(usuarioId)) {
      alert('No se encontró el ID del usuario autenticado.');
      return;
    }

    const today = new Date();
    const fechaLimite = new Date();
    fechaLimite.setDate(today.getDate() + 30);

    const servicioNombre = this.formFactura.value.servicio;
    const montoAleatorio =
      Math.floor(Math.random() * (50000 - 5000 + 1)) + 50000;

    const datosFactura: any = {
      // Guardamos el nombre del servicio (por ejemplo: "luz", "agua", etc.)
      servicio: servicioNombre,

      // Relación con la tabla de servicios (id que viene de la URL)
      id_servicio: this.servicioId,

      monto: montoAleatorio,
      estado: 'pendiente',
      fecha_emision: today.toISOString().split('T')[0],
      fecha_vencimiento: fechaLimite.toISOString().split('T')[0],
    };

    // Agregamos campos extra según el tipo de servicio
    if (servicioNombre === 'luz') {
      datosFactura.nic = this.formFactura.value.nic;
    } else if (servicioNombre === 'agua') {
      datosFactura.id_agua = this.formFactura.value.id_agua;
    } else if (servicioNombre === 'internet') {
      datosFactura.id_internet = this.formFactura.value.id_internet;
    }

    console.log('Factura enviada al backend:', datosFactura);

    this.facturaService.crearFactura(usuarioId, datosFactura).subscribe({
      next: () =>
        alert(`Factura de ${servicioNombre} registrada correctamente.`),
      error: (err) =>
        console.error(`Error al registrar factura de ${servicioNombre}`, err),
    });
  }
}
