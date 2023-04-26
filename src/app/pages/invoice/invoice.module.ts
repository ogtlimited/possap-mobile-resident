import { SharedModule } from './../../components/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvoicePageRoutingModule } from './invoice-routing.module';

import { InvoicePage } from './invoice.page';
import { Bank3dPaymentAngularModule } from 'bank3d-payment-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvoicePageRoutingModule,
    SharedModule,
    Bank3dPaymentAngularModule
  ],
  declarations: [InvoicePage]
})
export class InvoicePageModule {}
