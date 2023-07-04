/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { baseEndpoints, egsEndpoint } from 'src/app/core/config/endpoints';
import { IEGSFormData, IGeneric } from 'src/app/core/models/ResponseModel';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { EgsService } from 'src/app/core/services/egs/egs.service';
import { GlobalService } from 'src/app/core/services/global/global.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-egs',
  templateUrl: './egs.page.html',
  styleUrls: ['./egs.page.scss'],
})
export class EgsPage implements OnInit {
  serviceId: any;
  title = '';
  egsFormOne: FormGroup;
  egsFormThree: FormGroup;
  subCategoriesOptions: any;
  subSubCategoriesOption: any;
  showSubSub = false;
  step = 'one';
  user;
  subscription: Subscription;
  formData: IEGSFormData;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private egs: EgsService,
    private authS: AuthService,
    private globalS: GlobalService
  ) {
    this.subscription = this.authS.currentUser$.subscribe(
      (e) => (this.user = e)
    );
  }

  ngOnInit() {
    this.egsFormOne = this.fb.group({
      services: [this.title, Validators.required],
      subCategories: ['', Validators.required],
      subSubCategories: ['', Validators.required],
    });
    this.egsFormThree = this.fb.group({
      NumberOfOfficers: [0, [Validators.required, Validators.min(1)]],
    });
    this.egsFormOne.get('services').disable({});
    this.route.queryParams.subscribe((params) => {
      // console.log(params);
      this.serviceId = params.service;
      console.log(this.serviceId, 'SERVICEID');
      this.title = params.title;
      this.services.setValue(this.title);
      this.globalS
        .fetchStorageObject('EGSSUBCATEGORY')
        .subscribe(
          (str) => (this.subCategoriesOptions = JSON.parse(str.value))
        );
      this.globalS
        .fetchStorageObject('EGSSUBSUBCATEGORY')
        .subscribe(
          (str) => (this.subSubCategoriesOption = JSON.parse(str.value))
        );
      console.log(this.subCategoriesOptions);
    });
    this.subCategories.valueChanges.subscribe((val) => {
      if (val === 2) {
        this.showSubSub = true;
      }
      console.log(val);
    });
    this.fetchFormData();
  }

  onSubmit() {
    this.step = 'two';
    console.log(this.egsFormOne.value);
  }
  submitForm(event){
    console.log(event);
    this.step = 'three';
  }
  finalSubmit(){

  }

  fetchFormData() {
    this.egs.getFormData(this.user).subscribe((res: IGeneric) => {
      console.log(res);
      this.formData = res.data.ResponseObject;
    });
  }

  get subCategories() {
    return this.egsFormOne.get('subCategories');
  }
  get subSubCategories() {
    return this.egsFormOne.get('subSubCategories');
  }
  get services() {
    return this.egsFormOne.get('services');
  }
  get NumberOfOfficers() {
    return this.egsFormThree.get('NumberOfOfficers');
  }
}
