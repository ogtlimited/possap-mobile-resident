import { SharedModule } from './../../components/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AccountPage } from './account';
import { AccountPageRoutingModule } from './account-routing.module';
import { PasscodeComponent } from 'src/app/components/passcode/passcode.component';
import { PasswordFormComponent } from './password-form/password-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileComponentComponent } from './profile-component/profile-component.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    AccountPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AccountPage, PasswordFormComponent,ProfileComponentComponent],
})
export class AccountModule {}
