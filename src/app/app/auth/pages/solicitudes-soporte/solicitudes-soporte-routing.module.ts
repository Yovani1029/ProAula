import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SolicitudesSoportePage } from './solicitudes-soporte.page';

const routes: Routes = [
  {
    path: '',
    component: SolicitudesSoportePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SolicitudesSoportePageRoutingModule {}
