import { GlobalService } from './../../core/services/global/global.service';
/* eslint-disable @typescript-eslint/naming-convention */
import { ModalController, AlertController } from '@ionic/angular';
import { environment } from './../../../environments/environment.prod';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { Geolocation } from '@capacitor/geolocation';
import { Location } from '@angular/common';

declare let google;

@Component({
  selector: 'app-nearest-places',
  templateUrl: './nearest-places.page.html',
  styleUrls: ['./nearest-places.page.scss'],
})
export class NearestPlacesPage implements OnInit {
  @ViewChild('map') mapRef: ElementRef;
  map: GoogleMap;
  location = 'MY MAP';
  GoogleAutocomplete: any;
  constructor(
    private alert: AlertController,
    private loc: Location,
    private globalS: GlobalService
  ) {
    this.globalS.nearestPlaces('police station').subscribe((e) => {
      console.log(e);
    });
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.locateMe();
    this.createMap();
  }

  async createMap() {
    // const boundingRect = this.mapView.nativeElement.getBoundingClientRect() as DOMRect;
    this.map = await GoogleMap.create({
      id: 'sos-map',
      apiKey: environment.mapsKey,
      element: this.mapRef.nativeElement,
      forceCreate: true,
      config: {
        center: {
          lat: 33.6,
          lng: 9.7,
        },
        zoom: 8,
      },
    });
    await this.addMarkers();
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

  async addMarkers() {
    const markers: Marker[] = [
      {
        coordinate: {
          lat: 33.7,
          lng: -117.8,
        },
        title: 'localhost',
        snippet: 'Best place on earth',
      },
      {
        coordinate: {
          lat: 33.7,
          lng: -117.2,
        },
        title: 'random place',
        snippet: 'Not sure',
      },
    ];
    await this.map.addMarkers(markers);

    this.map.setOnMarkerClickListener(async (marker) => {
      console.log(marker);
      // const modal = await this.modalCtrl.create({
      //   component: ModalPage,
      //   componentProps: {
      //     marker,
      //   },
      //   breakpoints: [0, 0.3],
      //   initialBreakpoint: 0.3,
      // });
      // modal.present();
    });
  }

  async locateMe() {
    const coordinates = await Geolocation.getCurrentPosition();

    if (coordinates) {
      this.map.setCamera({
        coordinate: {
          lat: coordinates.coords.latitude,
          lng: coordinates.coords.longitude,
        },
        zoom: 12,
      });
    }
  }
}
