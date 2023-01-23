/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AlertController, LoadingController, ModalController} from '@ionic/angular';
import {AuthService} from 'src/app/core/services/auth/auth.service';
import {matchValidator} from '../../../providers/confirm.validator';

export interface Profile {
  createdAt: Date;
  updatedAt: Date;
  id: number;
  officerFormation: string;
  officerDepartment: string;
  officerSection: string;
  officerSubSection: string;
}

export interface Access {
  createdAt: Date;
  updatedAt: Date;
  id: number;
  role: string;
  accessType: string;
  services: number[];
  canApprove: string[];
}

export interface CommandAccessId {
  id: number;
  officerFormation: string;
  officerDepartment: string;
  officerSection: string;
  officerSubSection: string;
}

export interface User {
  createdAt: Date;
  updatedAt: Date;
  id: number;
  apNumber: string;
  fullName: string;
  userName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  state: string;
  lga: string;
  nin: string;
  profile: Profile;
  access: Access;
  commandAccessIds: CommandAccessId[];
}

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
})
export class PasswordFormComponent implements OnInit {
  passwordForm: FormGroup;
  hide = false;
  user: User;
  @Output() emitForm: EventEmitter<any> = new EventEmitter();
  constructor(
    private fb: FormBuilder,
    private modal: ModalController,
    private alertController: AlertController,
    private authService: AuthService,
    private loadingController: LoadingController,
    ) {}

  ngOnInit() {
    this.authService.currentUser().subscribe((str) => {
      this.user = JSON.parse(str.value);
    });
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required]],
      new_password: [
        '',
        [Validators.required, Validators.minLength(6)],
      ],
      confirm_password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          matchValidator('new_password'),
        ],
      ],
    });
  }

  get password() {
    return this.passwordForm.get('password');
  }

  get newPassword() {
    return this.passwordForm.get('new_password');
  }
  get confirmPassword() {
    return this.passwordForm.get('confirm_password');
  }

  async changePassword() {
    const loading = await this.loadingController.create();
    await loading.present();
    const credentials: any = {
      type: 'change',
      oldPassword: this.passwordForm.value.password,
      newPassword:this.passwordForm.value.confirm_password
    };


     this.authService.changePassword(this.user.id,credentials).subscribe(
      async (res) =>{
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Password change success',
          message: res.message,
          buttons: [{text:'OK', role:'confirm',handler:() => {
            this.authService.logout();

          },}],
        });
        await this.modal.dismiss();
        await alert.present();
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Password change failed',
          message: res.error.message,
          buttons: ['OK'],
        });

        await alert.present();
      }
     );
  }
}
