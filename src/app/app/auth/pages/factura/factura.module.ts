import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { FacturaPageRoutingModule } from './factura-routing.module';

import { FacturaPage } from './factura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FacturaPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [FacturaPage],
})
export class FacturaPageModule {}
