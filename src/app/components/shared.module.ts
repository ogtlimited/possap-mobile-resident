import { SlideToConfirmComponent } from './slide-to-confirm/slide-to-confirm.component';
import { PasscodeComponent } from './passcode/passcode.component';
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { HeaderComponent } from "./header/header.component";
import { FormComponent } from './dynamic-form/form/form.component';


@NgModule({
  declarations: [HeaderComponent, PasscodeComponent, SlideToConfirmComponent, FormComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  exports: [HeaderComponent, PasscodeComponent, SlideToConfirmComponent, FormComponent],
})
export class SharedModule {}
