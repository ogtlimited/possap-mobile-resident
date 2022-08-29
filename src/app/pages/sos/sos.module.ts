import { SharedModule } from './../../components/shared.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SosPageRoutingModule } from './sos-routing.module';

import { SosPage } from './sos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SosPageRoutingModule,
    SharedModule
  ],
  declarations: [SosPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SosPageModule {}
