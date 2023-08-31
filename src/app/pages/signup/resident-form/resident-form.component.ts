/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no-underscore-dangle */
import { LoadingController } from '@ionic/angular';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import {
  CorportateIdentificationTypesOption,
  IndividualIdentificationTypesOption,
} from 'src/app/core/data/formOptions';
import { stateOptions, lgaOptions } from 'src/app/core/data/lgas';

@Component({
  selector: 'app-resident-form',
  templateUrl: './resident-form.component.html',
  styleUrls: ['./resident-form.component.scss'],
})
export class ResidentFormComponent implements OnInit {
  @Output() emitFormValue: EventEmitter<any> = new EventEmitter();
  residentForm: FormGroup;
  hide = true;
  gotNIN = false;
  ninData: any = {};
  userImage: any;
  fileName = null;
  individualOptions = IndividualIdentificationTypesOption;
  corporateOptions = CorportateIdentificationTypesOption;
  idTypeOption = IndividualIdentificationTypesOption;
  formStage = 'One';
  ninError = false;
  allStates = stateOptions;
  stateLga = [];
  constructor(
    private fb: FormBuilder,
    private authS: AuthService,
    private _sanitizer: DomSanitizer,
    private loadS: LoadingController
  ) {}

  ngOnInit() {
    this.residentForm = this.fb.group(
      {
        TaxPayerType: ['1', [Validators.required]],
        IdType: ['1', [Validators.required]],
        //identificationfile: ['', [Validators.required]],
        IdNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
          ],
        ],
        Name: ['', [Validators.required]],
        Gender: ['', [Validators.required]],
        Email: ['', [Validators.required, Validators.email]],
        PhoneNumber: [
          '',
          [
            Validators.required,
            Validators.minLength(11),
            Validators.maxLength(11),
          ],
        ],
        RCNumber: [''],
        Password: ['', [Validators.required, Validators.minLength(6)]],
        ConfirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        SelectedState: ['', [Validators.required]],
        SelectedStateLGA: ['', [Validators.required]],
        Address: ['', [Validators.required]],
        ContactPersonName: [''],
        ContactPersonEmail: [''],
        ContactPersonPhoneNumber: [''],
      },
      {
        validator: this.ConfirmedValidator('Password', 'ConfirmPassword'),
      }
    );

    this.taxPayerType.valueChanges.subscribe((v) => {
      if (v === '1') {
        this.idTypeOption = IndividualIdentificationTypesOption;
      } else {
        this.idTypeOption = CorportateIdentificationTypesOption;
      }
      console.log(v, this.idTypeOption);
    });

    this.state.valueChanges.subscribe((state) => {
      this.stateLga = lgaOptions.filter((lga) => lga.StateCode === state);
      console.log(state);
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
          console.log('data:image/jpg;base64,' + this.ninData.photo);
          this.residentForm.patchValue({
            Name: this.ninData.surname + ' ' + this.ninData.firstname,
            dob: this.ninData.birthdate,
            // Email: 'acexode5848584858484@gmail.com',
            Email: this.ninData.email,
            Gender: this.ninData.gender === 'm' ? '1' : '2',
            //PhoneNumber: '07066547809',
            PhoneNumber: this.ninData.telephoneno,
            //SelectedState: 37,
             SelectedState: this.ninData.nok_state,
            //SelectedStateLGA: 315,
             SelectedStateLGA: this.ninData.nok_lga,
            Address: this.ninData.residence_AdressLine1,
          });
          this.fullName.disable();
          //this.email.disable();
          this.gender.disable();
          //this.phone.disable();
          //this.state.disable();
          //this.phone.disable();
          //this.lga.disable();
          this.gotNIN = true;
          this.loadS.dismiss();
        });
      } else {
        this.ninError = true;
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
    const formData = new FormData();
    const nonObject = ['TaxPayerType', 'IdType']; // removed 'identificationfile' from array
    Object.keys(this.residentForm.controls).forEach((formControlName) => {
      if (nonObject.includes(formControlName)) {
        formData.append(
          formControlName,
          this.residentForm.get(formControlName).value
        );
      } else {
        formData.append(
          'RegisterCBSUserModel.' + formControlName,
          this.residentForm.get(formControlName).value
        );
      }
    });
    console.log(this.residentForm.value);
    console.log(formData.get('TaxPayerType'));
    console.log(formData.get('IdNumber'));
    console.log(formData.get('RegisterCBSUserModel.Name'));
    console.log(formData.get('RegisterCBSUserModel.Email'));
    this.emitFormValue.emit(formData);
    // this.emitFormValue.emit(this.residentForm.value);
  }

  onFileSelect(event: Event, formControlName: string) {
    const file = (event.target as HTMLInputElement).files[0];
    this.fileName = file.name;
    this.residentForm.controls[formControlName].patchValue(file);
    this.residentForm.get(formControlName).updateValueAndValidity();
  }

  proceed() {
    this.formStage = 'Two';
  }
  get taxPayerType() {
    return this.residentForm.get('TaxPayerType');
  }
  get idType() {
    return this.residentForm.get('IdType');
  }
  get nin() {
    return this.residentForm.get('IdNumber');
  }
  get username() {
    return this.residentForm.get('username');
  }
  get fullName() {
    return this.residentForm.get('Name');
  }
  get gender() {
    return this.residentForm.get('Gender');
  }
  get email() {
    return this.residentForm.get('Email');
  }
  get phone() {
    return this.residentForm.get('PhoneNumber');
  }
  get state() {
    return this.residentForm.get('SelectedState');
  }
  get lga() {
    return this.residentForm.get('SelectedStateLGA');
  }
  get address() {
    return this.residentForm.get('Address');
  }

  get password() {
    return this.residentForm.get('Password');
  }
  get confirmPassword() {
    return this.residentForm.get('ConfirmPassword');
  }
  ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors.confirmedValidator
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
