import { PlacesCardComponent } from './places-card/places-card.component';
import { SharedModule } from './../../components/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NearestPlacesPageRoutingModule } from './nearest-places-routing.module';

import { NearestPlacesPage } from './nearest-places.page';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NearestPlacesPageRoutingModule,
    SharedModule,
    LeafletModule,
  ],
  declarations: [NearestPlacesPage, PlacesCardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NearestPlacesPageModule {}
