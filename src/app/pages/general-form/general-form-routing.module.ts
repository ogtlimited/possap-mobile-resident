import { CmrFormComponent } from './../../components/dynamic-form/cmr-form/cmr-form.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralFormPage } from './general-form.page';

const routes: Routes = [
  {
    path: '',
    component: GeneralFormPage
  },
  {
    path: 'cmr',
    component: CmrFormComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralFormPageRoutingModule {}
