/* eslint-disable @angular-eslint/component-selector */
import { OnInit } from '@angular/core';
/* eslint-disable @typescript-eslint/member-ordering */
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserData } from '../../providers/user-data';

import { UserOptions } from '../../interfaces/user-options';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../../core/services/auth/auth.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage implements OnInit {
  residentForm: FormGroup;
  forgotPassword: FormGroup;
  hide = true;
  userType = 'resident';
  showForgotPasswordPage = false;
  showForgotPasswordPageComplete = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.authService.isAuthenticated.subscribe((isAuth) => {
      console.log(isAuth);
      if (isAuth) {
        // Directly open inside area
        this.router.navigate(['/app/tabs/home']);
      }
    });

    this.residentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    this.forgotPassword = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      verificationCode: [''],
    });
  }

  changeUser(val) {
    this.userType = val;
  }

  async login(val) {
    console.log(val);
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.login(val).subscribe(
      async (res) => {
        await loading.dismiss();
        this.router.navigate(['/app/tabs/home']);
      },
      async (res) => {
        console.log(res);
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Login failed',
          message: res.error.error,
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }
  async submitForgotPassword() {
    const loading = await this.loadingController.create();
    await loading.present();
    if (!this.showForgotPasswordPageComplete) {
      this.authService
        .forgotPasswordInitiate({ email: this.femail.value })
        .subscribe(
          async (res) => {
            await loading.dismiss();
            this.showForgotPasswordPageComplete = true;
            this.reqFailed(
              'Success',
              'A verification token has been sent to your email'
            );
          },
          async (res) => {
            console.log(res);
            await loading.dismiss();
            this.reqFailed(res?.error?.error, 'Request failed');
          }
        );
    } else {
      this.authService
        .forgotPasswordComplete(this.forgotPassword.value)
        .subscribe(
          async (res) => {
            await loading.dismiss();
            this.reqFailed('Success', 'Password changed successfully');
            this.showForgotPasswordPage = false;
          },
          async (res) => {
            console.log(res);
            await loading.dismiss();
            this.reqFailed(res?.error?.error, 'Request failed');
          }
        );
    }
  }

  async reqFailed(res, msg) {
    const alert = await this.alertController.create({
      header: msg,
      message: res,
      buttons: ['OK'],
    });

    await alert.present();
  }
  // Easy access for form fields
  get email() {
    return this.residentForm.get('email');
  }
  get apNumber() {
    return this.residentForm.get('apNumber');
  }
  get femail() {
    return this.forgotPassword.get('email');
  }
  get fpwd() {
    return this.forgotPassword.get('password');
  }

  get password() {
    return this.residentForm.get('password');
  }
  get officerPassword() {
    return this.residentForm.get('password');
  }

  onSignup() {
    this.router.navigateByUrl('/signup');
  }
}
