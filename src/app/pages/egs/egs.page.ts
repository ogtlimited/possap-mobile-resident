/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { TermAndConditionsComponent } from 'src/app/components/term-and-conditions/term-and-conditions.component';
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
  estimateForm: FormGroup;
  subCategoriesOptions: any;
  subSubCategoriesOption: any;
  showSubSub = false;
  step = 'one';
  user;
  subscription: Subscription;
  formData: IEGSFormData;
  isModalOpen = false;
  mainFormValue: any = {};
  StateOptions: any;
  LGAOptions: any;
  estimatesResponse = null;
  labelValues = {};
  invoice: any;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private egs: EgsService,
    private authS: AuthService,
    private globalS: GlobalService,
    private loader: LoadingController,
    private modal: ModalController,
    private cdref: ChangeDetectorRef
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
    this.estimateForm = this.fb.group({
      stateId: [''],
      lgaId: [''],
      officerQty: [''],
      startDate: [''],
      endDate: [''],
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
        this.subSubCategories.setValidators([Validators.required]);
        this.subSubCategories.updateValueAndValidity();
      }else{
        this.showSubSub = false;
        this.subSubCategories.clearValidators();
        this.subSubCategories.updateValueAndValidity();
      }
      console.log(val);
    });
    this.fetchFormData();
    this.globalS.statesLgas$.subscribe((e) => {
      this.StateOptions = e;
    });
    this.SelectedState.valueChanges.subscribe((state) => {
      console.log(state);
      this.LGAOptions = this.StateOptions.filter(
        (val) => val.Id === state
      )[0].LGAs;
      console.log(this.LGAOptions);
    });
  }

  submitFormOne() {
    this.step = 'two';
    this.mainFormValue = {
      ...this.egsFormOne.value,
      subSubCategories: this.showSubSub ? this.subSubCategories.value : 0
    };
    this.openModal();
    console.log(this.mainFormValue);
  }
  submitFormTwo(event) {
    console.log(event, this.NumberOfOfficers);
    const { values, labelValues } = event;
    this.labelValues = labelValues;
    this.estimateForm.patchValue({
      stateId: values?.SelectedState,
      lgaId: values.SelectedStateLGA,
      endDate: this.formatDate(values?.EndDate),
      startDate: this.formatDate(values?.StartDate),
    });
    this.mainFormValue = {
      ...this.mainFormValue,
      ...values,
    };
    this.step = 'three';
  }
  async finalSubmit() {
    const loading = await this.loader.create();
    await loading.present();
    this.mainFormValue = {
      ...this.mainFormValue,
      ...this.egsFormThree.value,
      ServiceId: this.serviceId,
      SubCategoryId: this.mainFormValue.subCategories,
      SubSubCategoryId: this.mainFormValue.subSubCategories,
      StartDate: new Date(this.mainFormValue.StartDate).toLocaleDateString(
        'en-GB'
      ),
      EndDate: new Date(this.mainFormValue.EndDate).toLocaleDateString('en-GB'),
    };
    // this.mainFormValue = {
    //   Address: 'address lol',
    //   AddressOfOriginLocation: '',
    //   EndDate: '15/07/2023',
    //   NumberOfOfficers: 5,
    //   Reason: '',
    //   SelectedCommand: 0,
    //   SelectedCommandType: 3,
    //   SelectedEscortServiceCategories: '16,19',
    //   SelectedOriginLGA: 0,
    //   SelectedOriginState: 0,
    //   SelectedState: 3,
    //   SelectedStateLGA: 60,
    //   SelectedTacticalSquad: 0,
    //   ServiceId: '1',
    //   StartDate: '12/07/2023',
    //   SubCategoryId: 1,
    //   SubSubCategoryId: 0,
    // };
    console.log(this.mainFormValue);
    this.egs.submitConventionalEscort(this.mainFormValue, this.user).subscribe(
      (e: IGeneric) => {
        loading.dismiss();
        this.invoice = e.data.ResponseObject;
        this.step = 'four';
        console.log(e);
      },
      (err) => {
        console.log(err);
        loading.dismiss();
      }
    );
  }
  async openModal() {
    const modal = await this.modal.create({
      component: TermAndConditionsComponent,
      cssClass: 'terms-modal',
      breakpoints: [0.25],
      backdropDismiss: false,
      componentProps: {
        title: this.title.toLowerCase()
      },
    });
    modal.present();

    const { data } = await modal.onWillDismiss();

    console.log(data);
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
  get NumberOfOfficersEstimate() {
    return this.estimateForm.get('officerQty');
  }
  get SelectedStateLGA() {
    return this.estimateForm.get('lgaId');
  }
  get SelectedState() {
    return this.estimateForm.get('stateId');
  }
  async submitEstimate() {
    const { value } = this.estimateForm;
    const obj = {
      ...value,
      startDate: new Date(value.startDate).toLocaleDateString('en-GB'),
      endDate: new Date(value.endDate).toLocaleDateString('en-GB'),
      subSubTaxCategoryId: 0,
    };
    const loading = await this.loader.create();
    await loading.present();
    this.egs.getEstimates(obj).subscribe((e: IGeneric) => {
      console.log(e.data.ResponseObject);
      this.estimatesResponse = e.data.ResponseObject;
      loading.dismiss();
    });
  }

  toggleestimateModal() {
    this.isModalOpen = !this.isModalOpen;
    this.estimateForm.patchValue({
      officerQty: this.NumberOfOfficers.value,
    });
  }

  formatDate(date) {
    const newDate = new Date(date);
    console.log(newDate);
    return newDate.toJSON().split('T')[0];
  }
  goToStep(step) {
    this.step = step;
  }
}
