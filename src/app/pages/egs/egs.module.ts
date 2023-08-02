import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EgsPageRoutingModule } from './egs-routing.module';

import { EgsPage } from './egs.page';
import { SharedModule } from 'src/app/components/shared.module';
import { EgsFormPreviewComponent } from './egs-form-preview/egs-form-preview.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EgsPageRoutingModule,
    SharedModule,
    ReactiveFormsModule
  ],
  declarations: [EgsPage, EgsFormPreviewComponent]
})
export class EgsPageModule {}
