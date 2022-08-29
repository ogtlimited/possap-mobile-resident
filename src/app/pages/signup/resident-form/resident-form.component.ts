import { LoadingController } from '@ionic/angular';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-resident-form',
  templateUrl: './resident-form.component.html',
  styleUrls: ['./resident-form.component.scss'],
})
export class ResidentFormComponent implements OnInit {
  residentForm: FormGroup;
  @Output() emitFormValue: EventEmitter<any> = new EventEmitter();
  hide = false;
  gotNIN = false;
  ninData: any = {};
  userImage: any;
  constructor(
    private fb: FormBuilder,
    private authS: AuthService,
    private _sanitizer: DomSanitizer,
    private loadS: LoadingController
  ) {}

  ngOnInit() {
    this.residentForm = this.fb.group({
      nin: [
        '',
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      fullName: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.nin.valueChanges.subscribe((e) => {
      if (e.length === 11) {
        console.log(e);
        this.showLoading();
        this.gotNIN = false;
        this.authS.getNIN(e).subscribe((val) => {
          this.ninData = val.data;
          console.log(this.ninData);
          this.userImage = this._sanitizer.bypassSecurityTrustResourceUrl(
            'data:image/jpg;base64,' + this.ninData.photo
          );
          const dob = this.ninData.birthdate.split('-').reverse().join('-');

          this.residentForm.patchValue({
            fullName: this.ninData.surname + ' ' + this.ninData.firstname,
            dob: this.ninData.birthdate,
            email: this.ninData.email,
            phone: this.ninData.telephoneno,
          });
          this.gotNIN = true;
          this.loadS.dismiss();
        });
      } else {
        this.gotNIN = false;
      }
    });
  }

  async showLoading() {
    const loading = await this.loadS.create({
      message: 'Verifying...',
      duration: 3000,
      spinner: 'circles',
    });

    loading.present();
  }

  signup() {
    console.log(this.residentForm.value);
    this.emitFormValue.emit(this.residentForm.value);
  }
  get nin() {
    return this.residentForm.get('nin');
  }
  get username() {
    return this.residentForm.get('username');
  }
  get fullName() {
    return this.residentForm.get('fullName');
  }
  get dob() {
    return this.residentForm.get('dob');
  }
  get email() {
    return this.residentForm.get('email');
  }
  get phone() {
    return this.residentForm.get('phone');
  }

  get password() {
    return this.residentForm.get('password');
  }
}
