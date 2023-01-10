/* eslint-disable @typescript-eslint/member-ordering */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { User } from '../password-form/password-form.component';

@Component({
  selector: 'app-profile-component',
  templateUrl: './profile-component.component.html',
  styleUrls: ['./profile-component.component.scss'],
})
export class ProfileComponentComponent implements OnInit {
  userForm: FormGroup;
  user: User;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Output() emitForm: EventEmitter<any> = new EventEmitter();
  credentials: any;
  constructor(
    private fb: FormBuilder,
    private modal: ModalController,
    private alertController: AlertController,
    private authService: AuthService,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.authService.currentUser().subscribe((str) => {
      this.user = JSON.parse(str.value);
    });
    this.userForm = this.fb.group({
      fullName: '',
      email: ['', [Validators.email]],
      phone: ['', [Validators.minLength(8)]],
      state: [''],
      address: [''],
      lga: [''],
      nin: ''
    });
  }
  // Easy access for form fields
  get fullName() {
    return this.userForm.get('fullName');
  }
  get email() {
    return this.userForm.get('email');
  }
  get phone() {
    return this.userForm.get('phone');
  }
  get state() {
    return this.userForm.get('state');
  }
  get address() {
    return this.userForm.get('address');
  }
  get lga() {
    return this.userForm.get('lga');
  }
  async updateUser() {
    const credentials = {
      ...this.userForm.value,
      password: this.user.password
    };
    const loading = await this.loadingController.create();
    await loading.present();
    this.authService.updateUser(this.user.id, credentials).subscribe(
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Profile updated successfully',
          message: 'Profile Updated',
          buttons: ['OK'],
        });
        await this.modal.dismiss();
        await alert.present();
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Profile update failed',
          message: res.error.message,
          buttons: ['OK'],
        });

        await alert.present();
      }
    );
  }

}
