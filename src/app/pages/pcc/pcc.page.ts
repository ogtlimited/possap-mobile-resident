/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  LoadingController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TermAndConditionsComponent } from 'src/app/components/term-and-conditions/term-and-conditions.component';
import { baseEndpoints, serviceEndpoint } from 'src/app/core/config/endpoints';
import { RequestService } from 'src/app/core/request/request.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { FormProcessorService } from 'src/app/core/services/form-processor.service';
import { GlobalService } from 'src/app/core/services/global/global.service';
import { PossapServicesService } from 'src/app/core/services/possap-services/possap-services.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-pcc',
  templateUrl: './pcc.page.html',
  styleUrls: ['./pcc.page.scss'],
})
export class PccPage implements OnInit {
  title = 'Police Character Certificate';
  user;
  subscription: Subscription;
  showForm = true;
  invoiceDetails: any;
  serviceId: any;
  formData;
  type: any;
  isDiaspora = false;
  constructor(
    private possapS: PossapServicesService,
    private globalS: GlobalService,
    private loader: LoadingController,
    private alertC: AlertController,
    private reqS: RequestService,
    private modal: ModalController,
    private cdref: ChangeDetectorRef,
    private authS: AuthService,
    private fps: FormProcessorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subscription = this.authS.currentUser$.subscribe(
      (e) => (this.user = e)
    );
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.serviceId = params.service;
      this.title = params.title;
      if (this.title.toLowerCase().includes('diaspora')) {
        this.isDiaspora = true;
      }
      this.type = params.type;
      this.openModal();
    });
  }
  async openModal() {
    const modal = await this.modal.create({
      component: TermAndConditionsComponent,
      cssClass: 'terms-modal',
      breakpoints: [0.25],
      backdropDismiss: false,
      componentProps: {
        title: this.title.toLowerCase(),
      },
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
  }

  async onSubmit(obj) {
    this.formData = obj.labelValue;
    const loading = await this.loader.create();
    const headerObj = {
      CLIENTID: environment.clientId,
      CBSUSERID: this.user.CBSUserId,
      PAYERID: this.user.PayerId,
    };
    const mainValue = obj.mainValue;
    if (this.isDiaspora) {
      mainValue.SelectedIdentityType = 1;
      mainValue.IdentityValue = this.user.IdentificationNumber;
    }
    const hashString = `${headerObj.PAYERID}${headerObj.CLIENTID}`;
    const url = this.isDiaspora
      ? baseEndpoints.pccDiasporaRequest
      : baseEndpoints.pccRequest;
    const body = this.globalS.computeCBSBody(
      'post',
      url,
      headerObj,
      'SIGNATURE',
      hashString,
      mainValue
    );
    const requestOptions: any = {
      requestObject: body.requestObject,
    };
    await loading.present();
    this.reqS.postFormData(serviceEndpoint.savePCC, requestOptions).subscribe(
      (res: any) => {
        loading.dismiss();
        if (!res.data.Error) {
          // this.formData = val;
          // this.formData = this.tempData;
          console.log(res.data);
          this.showForm = false;
          this.invoiceDetails = res.data.ResponseObject || res.data;
          this.cdref.detectChanges();
        } else {
          const error = res.data.ResponseObject;
          this.reqFailed(
            'Error',
            typeof error === 'string' ? error : 'Unable to save request'
          );
        }
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
