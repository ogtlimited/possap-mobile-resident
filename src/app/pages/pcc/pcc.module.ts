import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PccPageRoutingModule } from './pcc-routing.module';

import { PccPage } from './pcc.page';
import { SharedModule } from 'src/app/components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PccPageRoutingModule,
    SharedModule
  ],
  declarations: [PccPage,]
})
export class PccPageModule {}
