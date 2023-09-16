import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PccPage } from './pcc.page';

const routes: Routes = [
  {
    path: '',
    component: PccPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PccPageRoutingModule {}
