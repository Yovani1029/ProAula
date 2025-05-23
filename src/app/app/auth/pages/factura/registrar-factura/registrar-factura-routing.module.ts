import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistrarFacturaPage } from './registrar-factura.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarFacturaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrarFacturaPageRoutingModule {}
