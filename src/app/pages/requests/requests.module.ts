import { AbbrevPipe } from './../../core/pipes/abbrev.pipe';
import { SharedModule } from './../../components/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestsPageRoutingModule } from './requests-routing.module';

import { RequestsPage } from './requests.page';
import { RequestDetailsComponent } from './request-details/request-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestsPageRoutingModule,
    SharedModule
  ],
  declarations: [RequestsPage, RequestDetailsComponent]
})
export class RequestsPageModule {}
