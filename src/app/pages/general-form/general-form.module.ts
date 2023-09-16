import { FormPreviewComponent } from './form-preview/form-preview.component';
import { SharedModule } from './../../components/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GeneralFormPageRoutingModule } from './general-form-routing.module';

import { GeneralFormPage } from './general-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GeneralFormPageRoutingModule,
    SharedModule
  ],
  declarations: [GeneralFormPage]
})
export class GeneralFormPageModule {}
