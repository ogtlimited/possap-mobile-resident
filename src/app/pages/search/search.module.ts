import { AbbrevPipe } from '../../core/pipes/abbrev.pipe';
import { SharedModule } from '../../components/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchPageRoutingModule } from './search-routing.module';

import { SearchPage } from './search.page';
import { RequestDetailsComponent } from 'src/app/pages/requests/request-details/request-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchPageRoutingModule,
    SharedModule,
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
