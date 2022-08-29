import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { InputComponent } from './components/input/input.component';
import { RadiosComponent } from './components/radios/radios.component';
import { SelectComponent } from './components/select/select.component';
import { CustomSelectDirective } from './directives/custom-select.directive';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { PasscodeFieldComponent } from '../passcode-field/passcode-field.component';

@NgModule({
  declarations: [
    SelectComponent,
    InputComponent,
    RadiosComponent,
    CustomSelectDirective,
    DatepickerComponent,
    AutocompleteComponent,
    PasscodeFieldComponent
  ],
  imports: [CommonModule, IonicModule, ReactiveFormsModule, AutoCompleteModule],
  exports: [
    SelectComponent,
    InputComponent,
    RadiosComponent,
    DatepickerComponent,
    AutocompleteComponent,
    PasscodeFieldComponent
  ],
})
export class OmnInputsModule {}
