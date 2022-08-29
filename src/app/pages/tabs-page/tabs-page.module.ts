import { PossapEyeComponent } from './possap-eye/possap-eye.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { TabsPage } from './tabs-page';
import { TabsPageRoutingModule } from './tabs-page-routing.module';

import { AboutModule } from '../about/about.module';

@NgModule({
  imports: [
    AboutModule,
    CommonModule,
    IonicModule,
    TabsPageRoutingModule
  ],
  declarations: [
    TabsPage,
    PossapEyeComponent
  ]
})
export class TabsModule { }
