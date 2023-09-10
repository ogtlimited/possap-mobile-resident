import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExtractsPageRoutingModule } from './extracts-routing.module';

import { ExtractsPage } from './extracts.page';
import { SharedModule } from 'src/app/components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExtractsPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [ExtractsPage]
})
export class ExtractsPageModule {}
