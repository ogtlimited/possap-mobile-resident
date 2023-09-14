import { ModalController, AlertController } from '@ionic/angular';
import { environment } from './../../../environments/environment.prod';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-sos',
  templateUrl: './sos.page.html',
  styleUrls: ['./sos.page.scss'],
})
export class SosPage implements OnInit {
  @ViewChild('map') mapRef: ElementRef;
  map;
  constructor(private alert: AlertController) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.createMap();
  }

  async createMap() {
    // const boundingRect = this.mapView.nativeElement.getBoundingClientRect() as DOMRect;
    // this.map = await GoogleMap.create({
    //   id: "sos-map",
    //   apiKey: environment.mapsKey,
    //   element: this.mapRef.nativeElement,
    //   forceCreate: true,
    //   config: {
    //     center: {
    //       lat: 33.6,
    //       lng: 9.7,
    //     },
    //     zoom: 8,
    //   },
    // });
    // CapacitorGoogleMaps.addListener('onMapReady', async () => {
    //   CapacitorGoogleMaps.setMapType({
    //     type: "normal" // hybrid, satellite, terrain
    //   });
    //   this.showCurrentPosition();
    // });
  }
  async presentAlert() {
    const presentAlert = await this.alert.create({
      message: 'Please enter phone number',
      buttons: [
        {
          text: 'Send',
          cssClass: 'alert-button-confirm',
          handler: (val) => {
            console.log(val);
          },
        },
      ],
      inputs: [
        {
          placeholder: 'Phone Number',
          name: 'phone',
          attributes: {
            maxlength: 11,
          },
        },
        {
          type: 'textarea',
          name: 'message',
          placeholder: 'message',
        },
      ],
    });

    presentAlert.present();
  }
  onConfirm() {}
}
