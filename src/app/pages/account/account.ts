/* eslint-disable @angular-eslint/component-selector */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { Location } from '@angular/common';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth/auth.service';

import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements OnInit {
  file: File = null;
  credentials: FormGroup;
  addressForm: FormGroup;
  user;
  avater = 'assets/img/speakers/lion.jpg';
  showAddressForm = false;
  items = [
    {
      title: 'My Request',
      url: '/menu/home/my-orders',
      icon: 'file-plus',
      autoNav: false,
    },
  ];
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router,
    private _location: Location,
    private modalController: ModalController,
    private loadingController: LoadingController
  ) {
    this.credentials = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(8)]],
      address: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.authService.currentUser().subscribe((str) => {
      const user = JSON.parse(str.value);
      console.log(user);
      this.user = user;
      this.credentials.patchValue({
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        address: user.address,
      });
    });
  }
  onChange(event) {
    this.file = event.target.files[0];
    this.onUpload();
  }
  async onUpload() {
    const data = new FormData();
    data.append('upload', this.file);
    console.log(this.file);
    const loading = await this.loadingController.create();
    await loading.present();
    this.authService.uploadProfileImage(data).subscribe(
      async (event: any) => {
        console.log(event);
        this.user.avater = event.images[0];
        const update = {
          avater: event.images[0],
        };
        this.authService
          .updateUser(this.user._id, update)
          .subscribe(async (e) => {
            // this.user = e.userInfo;
            console.log(e);
            this.authService.currentUser().subscribe((user) => {
              this.user = JSON.parse(user.value);
            });
            //console.log(e?.userInfo);
            await loading.dismiss();
          });
      },
      async (res) => {
        console.log(res);
        await loading.dismiss();
        this.reqFailed(res?.error?.error, 'Request failed');
      }
    );
  }
  async reqFailed(res, msg) {
    const alert = await this.alertController.create({
      header: msg,
      message: res,
      buttons: ['OK'],
    });

    await alert.present();
  }
  async presentModal(show) {
    const modal = await this.modalController.create({
      component: 'ProfileComponentsComponent',
      cssClass: 'fullscreen',
      componentProps: {
        show,
      },
    });
    await modal.present();
  }
  async updateUser() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.authService
      .updateUser(this.user._id, this.credentials.value)
      .subscribe(
        async (res) => {
          await loading.dismiss();
          this.router.navigate(['menu/home']);
        },
        async (res) => {
          console.log(res);
          await loading.dismiss();
          const alert = await this.alertController.create({
            header: res.error.message,
            message: res.error.error,
            buttons: ['OK'],
          });

          await alert.present();
        }
      );
  }
  back() {
    this._location.back();
  }
  navigate(path) {
    this.router.navigate(['menu/home/' + path]);
  }
  // Easy access for form fields
  get fullName() {
    return this.credentials.get('fullName');
  }

  get email() {
    return this.credentials.get('email');
  }

  get phone() {
    return this.credentials.get('phone');
  }
  get address() {
    return this.credentials.get('address');
  }
}
