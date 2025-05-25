import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DepositarPage } from './depositar.page';

const routes: Routes = [
  {
    path: '',
    component: DepositarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepositarPageRoutingModule {}
