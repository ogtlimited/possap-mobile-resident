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
import { ActivatedRoute, Params } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-general-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './general-form.page.html',
  styleUrls: ['./general-form.page.scss'],
})
export class GeneralFormPage implements OnInit {
  myParam: any;
  jsonFormData;
  title = '';
  showForm = true;
  formData;
  owner;
  serviceCharge: any;
  constructor(
    private route: ActivatedRoute,
    private possapS: PossapServicesService,
    private loader: LoadingController,
    private alertC: AlertController,
    private reqS: RequestService,
    private modal: ModalController,
    private cdref: ChangeDetectorRef,
    private authS: AuthService
  ) {}

  ngOnInit() {
    this.authS.currentUser$.subscribe((user) => {
      this.owner = user;
    });
    this.route.queryParams.subscribe((params) => {
      // console.log(params);

      this.myParam = params.service;
      this.title = params.title;
      if (params.type === 'restful') {
        this.possapS.fetchServicesbyId(this.myParam).subscribe((s: any) => {
          // console.log(s);
          this.jsonFormData = {
            controls: s.data.formSchema,
          };
          this.cdref.detectChanges();
          this.openModal();
        });
      } else {
        this.reqS
          .get('assets/data/' + this.myParam + '.json')
          .subscribe((e: any) => {
            // console.log(e);
            this.jsonFormData = e;
            // console.log(this.jsonFormData);
            this.cdref.detectChanges();
          });
      }
      // console.log(this.myParam);
    });
  }

  async submitForm(val) {
    console.log(val);
    const body = {
      service: this.myParam,
      owner: this.owner.id,
      formFields: [val],
    };
    const loading = await this.loader.create();
    this.showForm = true;
    await loading.present();
    this.possapS.getServiceCharge(this.myParam).subscribe(
      (e: any) => {
        loading.dismiss();
        console.log(e.data);
        this.serviceCharge = e.data;
        this.formData = val;
        this.showForm = false;
        this.cdref.detectChanges();
        console.log(this.showForm);
      },
      (err) => {
        loading.dismiss();
        this.reqFailed('Failure', 'Failed to make request');
        console.log(err);
      }
    );
    this.formData = val;
    this.showForm = false;
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
}
