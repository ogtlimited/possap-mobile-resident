import { GlobalService } from 'src/app/core/services/global/global.service';
import { baseEndpoints, serviceEndpoint } from './../../core/config/endpoints';
/* eslint-disable @typescript-eslint/naming-convention */
import { TermAndConditionsComponent } from '../../components/term-and-conditions/term-and-conditions.component';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { PossapServicesService } from './../../core/services/possap-services/possap-services.service';
import { RequestService } from './../../core/request/request.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { environment } from 'src/environments/environment.prod';
import { FormProcessorService } from 'src/app/core/services/form-processor.service';
import { EXTRACT, PCC, PCCD } from 'src/app/core/data/constant';
@Component({
  selector: 'app-general-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './general-form.page.html',
  styleUrls: ['./general-form.page.scss'],
})
export class GeneralFormPage implements OnInit {
  serviceId: any;
  jsonFormData;
  title = '';
  showForm = true;
  formData;
  owner;
  type = '';
  serviceCharge: any;
  serviceName = '';
  ownerStateOfOrigin = null;
  // tempData = {
  //   RequestType: '1',
  //   CharacterCertificateReasonForInquiry: '1',
  //   SelectedCountryOfOrigin: '2',
  //   PlaceOfBirth: 'Abuja',
  //   DateOfBirth: '18/02/1990',
  //   DestinationCountry: '1',
  //   SelectedCountryOfPassport: '3',
  //   SelectedStateOfOrigin: '2',
  //   PassportNumber: '98899999',
  //   PlaceOfIssuance: 'Abuja',
  //   DateOfIssuance: '18/06/2022',
  //   PreviouslyConvicted: 'false',
  //   PreviousConvictionHistory: '',
  //   passportphotographfile: '1683006479871.png',
  //   intpassportdatapagefile: '1683006487780.png',
  //   SelectedState: '2',
  //   SelectedCommand: '1',
  // };
  tempData = {
    1: ['2'],
    2: null,
    3: '',
    SelectedCategories: ['1'],
    IsIncidentReported: false,
    IncidentReportedDate: '',
    AffidavitFile: '1684361656956.png',
    AffidavitNumber: '5678909999',
    AffidavitDateOfIssuance: '18/05/2022',
    SelectedState: 37,
    SelectedStateLga: 315,
    SelectedCommand: 939,
  };
  invoiceDetails: any;

  constructor(
    private route: ActivatedRoute,
    private possapS: PossapServicesService,
    private globalS: GlobalService,
    private loader: LoadingController,
    private alertC: AlertController,
    private reqS: RequestService,
    private modal: ModalController,
    private cdref: ChangeDetectorRef,
    private authS: AuthService,
    private fps: FormProcessorService,
    private router: Router
  ) {
    // this.serviceSubmit(this.tempData);
  }
  ionViewWillEnter() {
    this.fps.formObject$.next(null);
    this.authS.currentUser$.subscribe((user) => {
      this.owner = user;
    });
    this.globalS.statesLgas$.subscribe((e) => {
      if (e) {
        this.ownerStateOfOrigin = e.filter(
          (v) => v?.Name === this.owner?.SelectedStateName
        )[0];
        console.log(this.ownerStateOfOrigin, 'STATE OF ORIGIN');
      }
    });
  }
  async ngOnInit() {
    const loading = await this.loader.create();
    await loading.present();

    this.fps.formObject$.subscribe((e) => {
      // console.log(e);
      if (e) {
        this.jsonFormData = {
          controls: e,
        };
        console.log(e);
        // this.submitForm(this.tempData);
        this.cdref.detectChanges();
        loading.dismiss();
      }
    });
    this.route.queryParams.subscribe((params) => {
      // console.log(params);

      this.serviceId = params.service;
      console.log(this.serviceId, 'SERVICEID');
      this.title = params.title;
      this.type = params.type;
      this.openModal();
      if (params.type === 'restful') {
        this.globalS.fetchStorageObject('CBS-SERVICES').subscribe((s: any) => {
          const parsed = JSON.parse(s.value);
          const obj = parsed.filter(
            (e) => e.ServiceId === parseInt(this.serviceId, 10)
          )[0];
          this.fps.formProcessor(obj);
          // console.log(obj);
          this.serviceName = obj.name;
        });
      } else {
        this.reqS
          .get('assets/data/' + this.serviceId + '.json')
          .subscribe((e: any) => {
            // console.log(e);
            this.jsonFormData = e;
            // console.log(this.jsonFormData);
            this.cdref.detectChanges();
          });
      }
      // console.log(this.serviceId);
    });
  }

  async submitForm(val) {
    console.log(val);
    if (this.type === 'misc') {
      await this.incidentReportSubmit(val);
    } else {
      this.formData = val.labelValue;
      await this.serviceSubmit(val.mainValue);
    }
  }

  previewFormat(val) {
    return {};
  }

  async openModal() {
    const modal = await this.modal.create({
      component: TermAndConditionsComponent,
      cssClass: 'terms-modal',
      breakpoints: [0.25],
      backdropDismiss: false,
      componentProps: {
        title: this.title.toLowerCase()
      },
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    console.log(data);
  }

  async reqFailed(header, msg) {
    const alert = await this.alertC.create({
      header,
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }

  async incidentReportSubmit(val) {
    const loading = await this.loader.create();
    this.showForm = true;
    await loading.present();
    this.possapS.postIncident(val).subscribe(
      async (e: any) => {
        await loading.dismiss();
        const alert = await this.alertC.create({
          header: 'Incident report.',
          message: 'Incident reported successfully.',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                this.router.navigate(['app/tabs/home']).then(() => {
                  alert.dismiss();
                });
              },
            },
          ],
        });
        await alert.present();
      },
      (err) => {
        loading.dismiss();
        this.reqFailed('Failure', 'Failed to make request');
        console.log(err);
      }
    );
    this.showForm = false;
  }

  async serviceSubmit(val) {
    let endpoint = '';
    console.log(val, this.serviceName);
    const loading = await this.loader.create();
    let body = null;
    if (this.serviceName.toLowerCase() === EXTRACT.toLowerCase()) {
      endpoint = serviceEndpoint.saveExtract;

      body = this.possapS.PSSExtractProcessor(val, this.serviceId);
    } else if (this.serviceName.toLowerCase() === PCC.toLowerCase()) {
      console.log('PCC', this.jsonFormData);
      endpoint = serviceEndpoint.savePCC;
      val.SelectedStateOfOrigin = this.ownerStateOfOrigin.Id;
      body = this.possapS.PCCProcessor(
        val,
        this.serviceId,
        this.jsonFormData.controls
      );
    }
    console.log(body);
    const requestOptions: any = {
      requestObject: body.requestObject,
    };

    this.showForm = true;
    await loading.present();

    console.log(requestOptions);
    this.reqS.postFormData(endpoint, requestOptions).subscribe(
      (res: any) => {
        console.log(res);
        loading.dismiss();
        if (!res.data.Error) {
          // this.formData = val;
          // this.formData = this.tempData;
          this.showForm = false;
          this.invoiceDetails = res.data.ResponseObject;
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
    // fetch(baseEndpoints.cbsRoutes, requestOptions)
    //   .then((response) => response.text())
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log('error', error));
    // this.possapS.allCBS(body).subscribe(
    //   (e: any) => {
    //     loading.dismiss();
    //     console.log(e.data);
    //     this.serviceCharge = e.data;
    //     this.formData = val;
    //     this.showForm = false;
    //     this.cdref.detectChanges();
    //     console.log(this.showForm);
    //   },
    // (err) => {
    //   loading.dismiss();
    //   this.reqFailed('Failure', 'Failed to make request');
    //   console.log(err);
    // }
    // );
  }
}
