/* eslint-disable @typescript-eslint/member-ordering */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PossapServicesService } from './../../../core/services/possap-services/possap-services.service';
import { AuthService } from './../../../core/services/auth/auth.service';
import { AlertController, ModalController } from '@ionic/angular';
import { GlobalService } from './../../../core/services/global/global.service';
import { PasscodeComponent } from 'src/app/components/passcode/passcode.component';
import { PasswordFormComponent } from '../../account/password-form/password-form.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resident-form',
  templateUrl: './resident-form.component.html',
  styleUrls: ['./resident-form.component.scss'],
})
export class ResidentFormComponent implements OnInit {
  residentForm: FormGroup;
  hide = false;
  resData: any;
  showForgotPasswordPage = false;
  showForgotPasswordPageComplete = false;
  @Output() emitForm: EventEmitter<any> = new EventEmitter();
  handlerMessage = '';
  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private possapS: PossapServicesService,
    private authS: AuthService,
    private globalS: GlobalService,
    private modalController: ModalController,
    private router: Router
  ) {}

  ngOnInit() {
    this.residentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Enter your email to reset',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.handlerMessage = `reset canceled`;
          },
        },
        {
          text: 'Submit',
          role: 'confirm',
          handler: (data) => {
            const date = new Date();
            const payload = {
              email: data.email,
            };
            this.authS.sendResetOtp(payload).subscribe((res: any) => {
              console.log(res);
              const message = res?.data?.message;
              this.resData = res;
              this.presentModal();
            });
            // this.handlerMessage = `${val} submitted`;
            console.log(payload);
          },
        },
      ],
      inputs: [
        {
          type: 'textarea',
          name: 'email',
          placeholder: 'email',
        },
      ],
    });

    await alert.present();
  }
  async presentModal() {
    const userData = this.resData.data;
    this.authS.tempUserData$.next(userData);
    console.log(userData, 'userrr');
    const modal = await this.modalController.create({
      component: PasscodeComponent,
      cssClass: 'fullscreen',
      componentProps: {
        submitOtp: this.doPassForm.bind(this, this.resData),
        reset: true,
      },
    });

    await modal.present();
  }

  async doPassForm(data, otp) {
    const payload = {
      email: data.data.email,
      code: otp,
      phone: data.data.phone,
    };
    console.log('payload', payload);
    this.authS.validateResetOtp(payload).subscribe((res: any) => {
      this.modalController.dismiss().then(() => this.openModal());
    });
  }

  async openModal() {
    const modal = await this.modalController.create({
      component: PasswordFormComponent,
      cssClass: 'fullscreen',
      componentProps: {
        reset: true,
      },
    });
    modal.present();
  }

  get email() {
    return this.residentForm.get('email');
  }

  get password() {
    return this.residentForm.get('password');
  }

  login() {
    this.emitForm.next(this.residentForm.value);
  }
}
