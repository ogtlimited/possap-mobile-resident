/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import {
  utilityEndpoint,
  serviceEndpoint,
} from 'src/app/core/config/endpoints';
import { IInvoiceResponseObject } from 'src/app/core/models/ResponseModel';
import { RequestService } from 'src/app/core/request/request.service';
import { GlobalService } from 'src/app/core/services/global/global.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-egs-form-preview',
  templateUrl: './egs-form-preview.component.html',
  styleUrls: ['./egs-form-preview.component.scss'],
})
export class EgsFormPreviewComponent implements OnInit {
  @Input() data;
  @Input() serviceName;
  @Input() serviceCharge;
  @Input() invoiceDetails: IInvoiceResponseObject;
  @Input() owner;
  @Input() service;
  @Input() formLabels;
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
      if (this.invoiceDetails) {
        this.mainFee = this.invoiceDetails.InvoiceItemsSummaries[0]?.UnitAmount;
        this.processingFee =
          this.invoiceDetails.InvoiceItemsSummaries[1]?.UnitAmount;
      }

      const extract = {
        Address: this.data.Address,
        'Service Requested': this.serviceName,
        'Police Command': this.formLabels.Command,
        // Destination: this.formatReason(this.data.SelectedCategories, this.data),
        'Service Category': this.formLabels.ServiceCategory,
        'Category Type': this.formLabels.SelectedCategoryType,
        Unit: this.formLabels.CommandType,
        'Number of Police Officers Required': this.data.NumberOfOfficers,
        Duration: this.data.StartDate + ' - ' + this.data.EndDate,
        'Duration(days)': this.datediff(this.data.StartDate, this.data.EndDate),
      };
      console.log(extract, 'test');
      this.keys = Object.keys(extract);
      this.values = Object.values(extract);
      this.cdref.detectChanges();
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

  datediff(first, second) {
    const date1 = new Date(this.formatDateToMMDDYYYY(first));
    const date2 = new Date(this.formatDateToMMDDYYYY(second));
    // To calculate the time difference of two dates
    const Difference_In_Time = date2.getTime() - date1.getTime();
    // To calculate the no. of days between two dates
    return Difference_In_Time / (1000 * 3600 * 24);
  }
  formatDateToMMDDYYYY(inputDate) {
    const [day, month, year] = inputDate.split('/');
    const formattedDate = `${month}/${day}/${year}`;
    return formattedDate;
  }
}
