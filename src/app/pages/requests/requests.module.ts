import { AbbrevPipe } from './../../core/pipes/abbrev.pipe';
import { SharedModule } from './../../components/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestsPageRoutingModule } from './requests-routing.module';

import { RequestsPage } from './requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestsPageRoutingModule,
    SharedModule
  ],
  declarations: [RequestsPage, AbbrevPipe]
})
export class RequestsPageModule {}
