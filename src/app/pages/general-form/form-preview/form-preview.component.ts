/* eslint-disable @typescript-eslint/naming-convention */
import { LoadingController, AlertController } from '@ionic/angular';
import { PossapServicesService } from './../../../core/services/possap-services/possap-services.service';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/core/services/global/global.service';
import {
  serviceEndpoint,
  utilityEndpoint,
} from 'src/app/core/config/endpoints';
import { environment } from 'src/environments/environment.prod';
import { RequestService } from 'src/app/core/request/request.service';
import { IInvoiceResponseObject } from 'src/app/core/models/ResponseModel';

@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss'],
})
export class FormPreviewComponent implements OnInit {
  @Input() data;
  @Input() serviceName;
  @Input() serviceCharge;
  @Input() invoiceDetails: IInvoiceResponseObject;
  @Input() owner;
  @Input() service;
  @Input() jsonFormData;
  read = false;
  accept = false;
  mainFee = 0;
  processingFee = 0;
  keys = [];
  values = [];
  constructor(
    private cdref: ChangeDetectorRef,
    private reqS: RequestService,
    private globalS: GlobalService,
    private loader: LoadingController,
    private alertC: AlertController,
    private router: Router
  ) {}

  checkImage(value) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(value);
  }

  ngOnInit() {
    console.log(this.invoiceDetails);
    console.log(this.data, this.serviceName);
    if (this.data) {
      if(this.invoiceDetails){

        this.mainFee = this.invoiceDetails.InvoiceItemsSummaries[0].UnitAmount;
        this.processingFee =
          this.invoiceDetails.InvoiceItemsSummaries[1].UnitAmount;
      }
      if (this.serviceName === 'POLICE EXTRACT') {
        const extract = {
          'Was Incident Reported': this.data.IsIncidentReported ? 'Yes' : 'No',
          'Court Affidavit Number': this.data.AffidavitNumber,
          'Court Affidavit Date of Issuance': this.data.AffidavitDateOfIssuance,
          'Reason for Request': this.formatReason(this.data.SelectedCategories, this.data),
        };
        console.log(extract, 'test');
        this.keys = Object.keys(extract);
        this.values = Object.values(extract);
        this.cdref.detectChanges();
      } else if (this.serviceName === 'POLICE CHARACTER CERTIFICATE') {
        const form = {
          'Police Command':
            this.data.SelectedCommand + ', ' + this.data.SelectedState,
          'Request Type': this.data.RequestType,
          'Reason for inquiry': this.data.CharacterCertificateReasonForInquiry,
          'Country of Origin': this.data.SelectedCountryOfOrigin,
          'Place of Birth': this.data.PlaceOfBirth,
          'Date of Birth': this.data.DateOfBirth,
          'Country of Passport': this.data.SelectedCountryOfPassport,
          'Passport Number': this.data.PassportNumber,
          'Place of Issuance': this.data.PlaceOfIssuance,
          'Date of Issuance': this.data.DateOfIssuance,
        };
        console.log(form, 'test');
        this.keys = Object.keys(form);
        this.values = Object.values(form);
      }
    }
  }

  async generateInvoice() {
    const headerObj = {
      CLIENTID: environment.clientId,
    };
    const hashmessage = `${this.invoiceDetails.InvoiceNumber}${headerObj.CLIENTID}`;
    const url =
      utilityEndpoint.paymentRef + '/' + this.invoiceDetails.InvoiceNumber;
    const body = this.globalS.computeCBSBody(
      'get',
      url,
      headerObj,
      'SIGNATURE',
      hashmessage
    );
    const loading = await this.loader.create();
    await loading.present();
    this.reqS.postFormData(serviceEndpoint.fetchData, body).subscribe(
      (e: any) => {
        loading.dismiss();
        console.log(e);
        const invoice = {
          ...this.invoiceDetails,
          InvoiceId: e.data.ResponseObject,
        };
        this.router.navigate([
          '/invoice',
          { details: JSON.stringify(invoice) },
        ]);
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

  formatReason(reasons, obj) {
    return reasons
      .map((e, i) => e + ': ' + obj[i + 1].join(', '))
      .join(', ');
  }
}
