import { SlideToConfirmComponent } from './slide-to-confirm/slide-to-confirm.component';
import { PasscodeComponent } from './passcode/passcode.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { FormComponent } from './dynamic-form/form/form.component';
import { HeaderComponent } from './header/header.component';
import { SelectComponent } from './select/select.component';


@NgModule({
  declarations: [HeaderComponent, PasscodeComponent, SlideToConfirmComponent, FormComponent, SelectComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  exports: [HeaderComponent, PasscodeComponent, SlideToConfirmComponent, FormComponent, SelectComponent],
})
export class SharedModule {}
