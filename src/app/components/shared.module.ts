import { SearchComponent } from './search/search.component';
import { CmrFormComponent } from './dynamic-form/cmr-form/cmr-form.component';
import { AbbrevPipe } from './../core/pipes/abbrev.pipe';
import { SlideToConfirmComponent } from './slide-to-confirm/slide-to-confirm.component';
import { PasscodeComponent } from './passcode/passcode.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { FormComponent } from './dynamic-form/form/form.component';
import { HeaderComponent } from './header/header.component';
import { SelectComponent } from './select/select.component';
import { NextApprovalLevelPipe } from '../core/pipes/next-approval-level.pipe';
import { RequestDetailsReusableComponent } from './request-details-reusable/request-details-reusable.component';
import { FormPreviewComponent } from '../pages/general-form/form-preview/form-preview.component';
import { TermAndConditionsComponent } from './term-and-conditions/term-and-conditions.component';
import { EgsFormComponent } from './dynamic-form/egs-form/egs-form.component';
import { PccFormComponent } from './dynamic-form/pcc-form/pcc-form.component';
import { SelectSearchModalComponent } from './select-search-modal/select-search-modal.component';

@NgModule({
  declarations: [
    HeaderComponent,
    PasscodeComponent,
    SlideToConfirmComponent,
    FormComponent,
    SelectComponent,
    AbbrevPipe,
    NextApprovalLevelPipe,
    CmrFormComponent,
    SearchComponent,
    RequestDetailsReusableComponent,
    FormPreviewComponent,
    TermAndConditionsComponent,
    EgsFormComponent,
    PccFormComponent,
    SelectSearchModalComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule],
  exports: [
    HeaderComponent,
    PasscodeComponent,
    SlideToConfirmComponent,
    FormComponent,
    SelectComponent,
    AbbrevPipe,
    CmrFormComponent,
    NextApprovalLevelPipe,
    SearchComponent,
    RequestDetailsReusableComponent,
    FormPreviewComponent,
    TermAndConditionsComponent,
    EgsFormComponent,
    PccFormComponent,
    SelectSearchModalComponent
  ],
})
export class SharedModule {}
