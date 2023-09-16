import { GlobalService } from './../../core/services/global/global.service';
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
// import { Map, Control, DomUtil, ZoomAnimEvent , Layer, MapOptions, tileLayer, latLng } from 'leaflet';
import { Location } from '@angular/common';
import { Observable, Subscriber } from 'rxjs';
import * as L from 'leaflet';

@Component({
  selector: 'app-osm-map',
  templateUrl: './nearest-places.page.html',
  styleUrls: ['./nearest-places.page.scss'],
})

export class NearestPlacesPage implements OnInit {
  public map;
  public zoom: number;
  location = 'MY MAP';
  GoogleAutocomplete: any;

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
    this.location = val;
    this.GoogleAutocomplete.getPlacePredictions(
      { input: val },
      (predictions, status) => {
        // this.autocompleteItems = [];
        console.log(predictions);
        // this.zone.run(() => {
        //   predictions.forEach((prediction) => {
        //     this.autocompleteItems.push(prediction);
        //   });
        // });
      }
    );
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
        console.log([position.coords.latitude, position.coords.longitude]);
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }


  private loadMap(): void {
    this.map = L.map('map').setView([0, 0], 1);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: `Map data &copy; <a href="https://www.openstreetmap.org/copyright">
                          OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>`,
      // maxZoom: 18,
      id: 'mapbox/streets-v11',
      // tileSize: 512,
      // zoomOffset: -1,
      accessToken: 'pk.eyJ1Ijoia2hhZGlqYWxhZGFuIiwiYSI6ImNsYW1iMDZsODBkOHMzc29iMnFiYm04aHYifQ.5fKJF4M1NlLrMafVqix3Cg'
    }).addTo(this.map);

    this.getCurrentPosition()
    .subscribe((position: any) => {
      this.map.flyTo([position.latitude, position.longitude], 15);

      const icon = L.icon({
        iconUrl: 'assets/img/marker-icon.png',
        shadowUrl: 'assets/img/marker-shadow.png',
        popupAnchor: [13, 0],
      });

      const marker = L.marker([position.latitude, position.longitude], { icon }).bindPopup('Angular Leaflet');
      marker.addTo(this.map);
    });
  }
}
