import { GlobalService } from './../../core/services/global/global.service';
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Observable, Subscriber } from 'rxjs';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-osm-map',
  templateUrl: './nearest-places.page.html',
  styleUrls: ['./nearest-places.page.scss'],
})

export class NearestPlacesPage implements OnInit {
  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v12';
  lat = 9.0820;
  lng = 8.6753;
  location = 'MY MAP';

  constructor(
    private alert: AlertController,
    private loc: Location,
    private globalS: GlobalService
  ) {
    // this.globalS.nearestPlaces('police station').subscribe((e) => {
    //   console.log(e);
    // });
  }

  ngOnInit() {
    this.loadMap();
  }

  mapLocation(val) {
    console.log(val);
    // this.location = val;
    // this.GoogleAutocomplete.getPlacePredictions(
    //   { input: val },
    //   (predictions, status) => {
    //     // this.autocompleteItems = [];
    //     console.log(predictions);
    //     // this.zone.run(() => {
    //     //   predictions.forEach((prediction) => {
    //     //     this.autocompleteItems.push(prediction);
    //     //   });
    //     // });
    //   }
    // );
  }

  back() {
    this.loc.back();
  }

  private getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        console.log([position.coords.latitude, position.coords.longitude]);
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }


  private loadMap(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      accessToken: environment.mapbox.accessToken,
      style: this.style,
      zoom: 13,
      center: [this.lng, this.lat]
    });
    // Add map controls
    this.map.addControl(new mapboxgl.NavigationControl());
    this.map.addControl(
      new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true
      })
    );

    const marker = new mapboxgl.Marker()
    .setLngLat([this.lng, this.lat])
    .addTo(this.map);
  }
}
