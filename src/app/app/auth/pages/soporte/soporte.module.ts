import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SoportePageRoutingModule } from './soporte-routing.module';

import { SoportePage } from './soporte.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    SoportePageRoutingModule
  ],
  declarations: [SoportePage]
})
export class SoportePageModule {}
