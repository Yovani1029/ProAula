import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FacturaPage } from './factura.page';

const routes: Routes = [
  {
    path: '',
    component: FacturaPage
  },  {
    path: 'registrar-factura',
    loadChildren: () => import('./registrar-factura/registrar-factura.module').then( m => m.RegistrarFacturaPageModule)
  },
  {
    path: 'pagar-factura',
    loadChildren: () => import('./pagar-factura/pagar-factura.module').then( m => m.PagarFacturaPageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FacturaPageRoutingModule {}
