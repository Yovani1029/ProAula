import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PagarFacturaPageRoutingModule } from './pagar-factura-routing.module';

import { PagarFacturaPage } from './pagar-factura.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PagarFacturaPageRoutingModule
  ],
  declarations: [PagarFacturaPage]
})
export class PagarFacturaPageModule {}
