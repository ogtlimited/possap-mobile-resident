import { ResidentFormComponent } from './resident-form/resident-form.component';
import { SharedModule } from './../../components/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SignupPage } from './signup';
import { SignupPageRoutingModule } from './signup-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SharedModule,
    SignupPageRoutingModule
  ],
  declarations: [
    SignupPage,
    ResidentFormComponent,
  ]
})
export class SignUpModule { }
