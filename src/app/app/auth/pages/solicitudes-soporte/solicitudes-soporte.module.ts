import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SolicitudesSoportePageRoutingModule } from './solicitudes-soporte-routing.module';

import { SolicitudesSoportePage } from './solicitudes-soporte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SolicitudesSoportePageRoutingModule
  ],
  declarations: [SolicitudesSoportePage]
})
export class SolicitudesSoportePageModule {}
