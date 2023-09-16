import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EgsPage } from './egs.page';

const routes: Routes = [
  {
    path: '',
    component: EgsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EgsPageRoutingModule {}
