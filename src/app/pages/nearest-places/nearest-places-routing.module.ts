import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NearestPlacesPage } from './nearest-places.page';

const routes: Routes = [
  {
    path: '',
    component: NearestPlacesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NearestPlacesPageRoutingModule {}
