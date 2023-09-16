import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExtractsPage } from './extracts.page';

const routes: Routes = [
  {
    path: '',
    component: ExtractsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExtractsPageRoutingModule {}
