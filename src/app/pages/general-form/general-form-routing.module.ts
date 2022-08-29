import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GeneralFormPage } from './general-form.page';

const routes: Routes = [
  {
    path: '',
    component: GeneralFormPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralFormPageRoutingModule {}
