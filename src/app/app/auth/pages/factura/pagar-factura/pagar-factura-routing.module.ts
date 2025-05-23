import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PagarFacturaPage } from './pagar-factura.page';

const routes: Routes = [
  {
    path: '',
    component: PagarFacturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagarFacturaPageRoutingModule {}
