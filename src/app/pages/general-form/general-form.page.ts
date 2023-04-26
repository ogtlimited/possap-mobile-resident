import { GlobalService } from 'src/app/core/services/global/global.service';
import { baseEndpoints } from './../../core/config/endpoints';
/* eslint-disable @typescript-eslint/naming-convention */
import { TermAndConditionsComponent } from './term-and-conditions/term-and-conditions.component';
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

  async ngOnInit() {
    const loading = await this.loader.create();
    await loading.present();

    this.authS.currentUser$.subscribe((user) => {
      this.owner = user;
    });
    this.fps.formObject$.subscribe((e) => {
      console.log(e);
      if (e) {
        this.jsonFormData = {
          controls: e,
        };
        this.cdref.detectChanges();
        loading.dismiss();
      }
    });
    this.route.queryParams.subscribe((params) => {
      // console.log(params);

      this.serviceId = params.service;
      this.title = params.title;
      this.type = params.type;
      if (params.type === 'restful') {
        this.globalS.fetchStorageObject('CBS-SERVICES').subscribe((s: any) => {
          const parsed = JSON.parse(s.value);
          const obj = parsed.filter((e) => e.ServiceId === parseInt(this.serviceId, 10))[0];
          this.fps.pEFormSchema(obj.formSchema);
          this.cdref.detectChanges();
          console.log(obj);
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
      await this.serviceSubmit(val);
    }
  }

  async openModal() {
    const modal = await this.modal.create({
      component: TermAndConditionsComponent,
      cssClass: 'terms-modal',
      breakpoints: [0.25],
      backdropDismiss: false,
      componentProps: {},
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
    // const body = {
    //   service: this.serviceId,
    //   owner: this.owner.id,
    //   formFields: [val],
    // };
    console.log(val);
    const loading = await this.loader.create();
    const body = this.possapS.PSSExtractProcessor(val);
    console.log(body);
    const requestOptions: any = {
      requestObject: body.requestObject,
    };

    this.showForm = true;
    await loading.present();

    console.log(requestOptions);
    this.reqS.postFormData(baseEndpoints.cbsRoutes, requestOptions).subscribe(
      (res: any) => {
        console.log(res);
        loading.dismiss();
        this.formData = val;
        // this.showForm = false;
        this.cdref.detectChanges();
        this.router.navigate([
          '/invoice',
          { details: JSON.stringify(res.data.ResponseObject) },
        ]);
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
