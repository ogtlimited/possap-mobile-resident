/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController,AlertController,LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { matchValidator } from '../../../providers/confirm.validator';

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
  phoneNumber: string;
  password: string;
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
    private router: Router
    ) {}

  ngOnInit() {
    this.authService.currentUser().subscribe((str) => {
      const user = JSON.parse(str.value);
      this.user = user;
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
      oldPassword: this.passwordForm.value.password,
      newPassword:this.passwordForm.value.confirm_password
    };


     this.authService.changePassword(this.user.id,credentials).subscribe(
      async (res) =>{
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Password change success',
          message: res.message,
          buttons: ['OK'],
        });
        await alert.present();
        this.authService.logout();
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
