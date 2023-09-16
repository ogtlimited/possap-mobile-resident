import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TutorialPage } from './tutorial';
import { CheckTutorial } from 'src/app/providers/check-tutorial.service';

const routes: Routes = [
  {
    path: '',
    component: TutorialPage,
    canActivate: [CheckTutorial]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorialPageRoutingModule { }
