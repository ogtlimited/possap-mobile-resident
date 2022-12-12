import { LoadingController, AlertController } from '@ionic/angular';
import { PossapServicesService } from './../../../core/services/possap-services/possap-services.service';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss'],
})
export class FormPreviewComponent implements OnInit {
  @Input() data;
  @Input() serviceCharge;
  @Input() owner;
  @Input() service;
  @Input() jsonFormData;
  keys = [];
  values = [];
  constructor(
    private possapS: PossapServicesService,
    private loader: LoadingController,
    private alertC: AlertController,
    private router: Router
  ) {}

  checkImage(value) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(value);
  }

  ngOnInit() {
    console.log(this.jsonFormData);
    if (this.data) {
      this.keys = Object.keys(this.data).map((v) =>
        v.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      );
      this.values = Object.values(this.data);
      console.log(this.values, 'test');
    }
  }

  async generateInvoice() {
    const body = {
      service: this.service,
      owner: this.owner.id,
      formFields: [this.data],
      amount:
        this.serviceCharge?.invoiceAmount + this.serviceCharge?.proccessingFee,
    };
    const loading = await this.loader.create();
    await loading.present();
    this.possapS.postRequest(body).subscribe(
      (e: any) => {
        loading.dismiss();
        console.log(e);
        this.router.navigate(['/invoice', { details: JSON.stringify(e.data) }]);
      },
      (err) => {
        loading.dismiss();
        this.reqFailed('Failure', 'Failed to make request');
        console.log(err);
      }
    );
  }

  async reqFailed(header, msg) {
    const alert = await this.alertC.create({
      header,
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
