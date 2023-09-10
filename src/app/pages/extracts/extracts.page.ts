/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CameraSource, Camera, CameraResultType } from '@capacitor/camera';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { SelectSearchModalComponent } from 'src/app/components/select-search-modal/select-search-modal.component';
import { TermAndConditionsComponent } from 'src/app/components/term-and-conditions/term-and-conditions.component';
import { baseEndpoints, serviceEndpoint } from 'src/app/core/config/endpoints';
import { IGenericResponse } from 'src/app/core/models/ResponseModel';
import { RequestService } from 'src/app/core/request/request.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { GlobalService } from 'src/app/core/services/global/global.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-extracts',
  templateUrl: './extracts.page.html',
  styleUrls: ['./extracts.page.scss'],
})
export class ExtractsPage implements OnInit {
  extractForm: FormGroup;
  affidavitFile;
  serviceId: any;
  title = 'Police Extract';
  type: any;
  serviceName: any;
  ExtractCategories;
  documentOptions;
  propertyOptions;
  StateLGAs = [];
  LGAs = [];
  Commands = [];
  CommandOptions = [];
  tempForm: any = {};
  user;
  subscription: Subscription;
  showForm = true;
  invoiceDetails: any;
  alertC: any;
  formData: any;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    private globalS: GlobalService,
    private loader: LoadingController,
    private reqS: RequestService,
    private modal: ModalController,
    private cdref: ChangeDetectorRef,
    private authS: AuthService
  ) {
    this.subscription = this.authS.currentUser$.subscribe(
      (e) => (this.user = e)
    );
  }

  ngOnInit(): void {
    this.agreeModal();
    this.extractForm = this.fb.group({
      AffidavitDateOfIssuance: ['', Validators.required],
      AffidavitFile: ['', Validators.required],
      lossOfDocument: [''],
      lossOfProperty: [''],
      others: [''],
      AffidavitNumber: ['', Validators.required],
      IncidentReportedDate: [''],
      IsIncidentReported: [false, Validators.required],
      SelectedCategories: ['', Validators.required],
      // SelectedCategoriesAndSubCategories: ['', Validators.required],
      SelectedCommand: ['', Validators.required],
      SelectedState: ['', Validators.required],
      SelectedStateLga: ['', Validators.required],
      // SelectedSubCategories: ['', Validators.required],
      ServiceId: ['', Validators.required],
    });
    this.loadData();
    this.IsIncidentReported.valueChanges.subscribe((e) => {
      if (e === 'true') {
        this.IncidentReportedDate.setValidators([Validators.required]);
      } else {
        this.IncidentReportedDate.clearValidators();
      }
      this.cdref.detectChanges();
      this.extractForm.updateValueAndValidity();
    });
  }

  async agreeModal() {
    const modal = await this.modal.create({
      component: TermAndConditionsComponent,
      cssClass: 'terms-modal',
      breakpoints: [0.25],
      backdropDismiss: false,
      componentProps: {
        title: this.title.toLowerCase(),
      },
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
  }

  async onSubmit() {
    const { value } = this.extractForm;
    const obj = {
      SelectedSubCategories: '',
      SelectedCategoriesAndSubCategories: {
        1: value.lossOfDocument,
        2: value.lossOfProperty,
      },
      Reason: value?.others || '',
      ServiceId: value.ServiceId,
      SelectedCategories: value.SelectedCategories.join(','),
      IsIncidentReported: value.IsIncidentReported === 'true' ? true : false,
      IncidentReportedDate:
        value.IsIncidentReported === 'true'
          ? this.formatCBSDate(value.IncidentReportedDate)
          : '',
      AffidavitFile: value.AffidavitFile,
      AffidavitNumber: value.AffidavitNumber,
      AffidavitDateOfIssuance: this.formatCBSDate(
        value.AffidavitDateOfIssuance
      ),
      SelectedState: this.tempForm.SelectedState,
      SelectedStateLga: this.tempForm.SelectedStateLga,
      SelectedCommand: this.tempForm.SelectedCommand,
    };
    const sub = [];
    if (value.lossOfDocument !== '') {
      sub.push(...value.lossOfDocument);
    }
    if (value.lossOfProperty !== '') {
      sub.push(...value.lossOfProperty);
    }
    obj.SelectedSubCategories = sub.join();
    const ld = this.documentOptions
      .filter((e) => value.lossOfDocument.includes(e.Id))
      .map((d) => d.Name);
    const lp = this.propertyOptions
      .filter((e) => value.lossOfProperty.includes(e.Id))
      .map((d) => d.Name);
    this.formData = value;

    this.formData.reasons = [...ld, ...lp].join();

    const loading = await this.loader.create();

    const headerObj = {
      CLIENTID: environment.clientId,
      PAYERID: this.user.PayerId,
    };
    const hashString = `${obj.SelectedCommand}${obj.ServiceId}${headerObj.PAYERID}${headerObj.CLIENTID}`;
    const body = this.globalS.computeCBSBody(
      'post',
      baseEndpoints.extractRequest,
      headerObj,
      'SIGNATURE',
      hashString,
      obj
    );
    const requestOptions: any = {
      requestObject: body.requestObject,
    };
    await loading.present();
    this.reqS
      .postFormData(serviceEndpoint.saveExtract, requestOptions)
      .subscribe(
        (res: any) => {
          loading.dismiss();
          if (!res.data.Error) {
            // this.formData = val;
            // this.formData = this.tempData;
            this.showForm = false;
            this.invoiceDetails = res.data.ResponseObject;
            this.cdref.detectChanges();
          } else {
            const error = res.data.ResponseObject;
            this.reqFailed(
              'Error',
              typeof error === 'string' ? error : 'Unable to save request'
            );
          }
        },
        (err) => {
          loading.dismiss();
          this.reqFailed('Failure', 'Failed to make request');
          console.log(err);
        }
      );
  }
  async reqFailed(header, msg) {
    const alert = await this.alertC.create({
      header,
      message: msg,
      buttons: ['OK'],
    });

    await alert.present();
  }

  loadData() {
    this.route.queryParams.subscribe((params) => {

      this.serviceId = params.service;
      this.extractForm.get('ServiceId').setValue(params.service);
      this.title = params.title;
      this.type = params.type;
      // this.openModal();
      this.globalS.fetchStorageObject('CBS-SERVICES').subscribe((s: any) => {
        const parsed = JSON.parse(s.value);
        const obj = parsed.filter(
          (e) => e.ServiceId === parseInt(this.serviceId, 10)
        )[0];

        this.getFormData();
        this.serviceName = obj.name;
      });

    });
    this.globalS.fetchStorageObject('states').subscribe((e) => {
      this.StateLGAs = JSON.parse(e.value);
    });
  }
  async getFormData() {
    const endpoint = baseEndpoints.extractFormdata;
    const loading = await this.loader.create();
    await loading.present();
    this.reqS.get(endpoint).subscribe((data: IGenericResponse) => {
      loading.dismiss();
      this.ExtractCategories = data.ResponseObject.ExtractCategories;
      this.documentOptions = this.ExtractCategories[0].SubCategories;
      this.propertyOptions = this.ExtractCategories[1].SubCategories;
      this.Commands = data.ResponseObject.Commands;
      // this.RequestTypes = data.ResponseObject.RequestTypes;
      // this.Countries = data.ResponseObject.Countries;

      // this.ReasonsForInquiryOptions =
      //   data.ResponseObject.CharacterCertificateReasonsForInquiry;
    });
  }

  async openModal(placeholder, list, field) {
    const modal = await this.modal.create({
      component: SelectSearchModalComponent,
      cssClass: 'select-search-modal',
      breakpoints: [0.25],
      componentProps: {
        placeholder,
        list,
      },
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    this.LGAs = data.LGAs;
    if (data) {
      this.tempForm[field] = data?.Id;
      this.extractForm.get(field).setValue(data?.Name);
      if (field === 'SelectedStateLga') {
        this.fetchCommands(data.Id);
      }
    }
    this.cdref.detectChanges();
  }

  async fetchCommands(id) {
    const res: any = await this.reqS
      .post(baseEndpoints.helper + '/state-area-division', {
        state: id,
        serviceId: this.serviceId,
      })
      .toPromise();
    if (res.data) {
      const mapped = res.data.map((e) => ({
        Name: e.label.split('- ')[1],
        Id: e.value,
      }));
      this.openModal('Select State of Origin', mapped, 'SelectedCommand');
    }
  }

  get AffidavitDateOfIssuance() {
    return this.extractForm.get('AffidavitDateOfIssuance');
  }
  get AffidavitFile() {
    return this.extractForm.get('AffidavitFile');
  }
  get AffidavitNumber() {
    return this.extractForm.get('AffidavitNumber');
  }
  get IncidentReportedDate() {
    return this.extractForm.get('IncidentReportedDate');
  }
  get IsIncidentReported() {
    return this.extractForm.get('IsIncidentReported');
  }
  get SelectedCategories() {
    return this.extractForm.get('SelectedCategories');
  }
  get SelectedCommand() {
    return this.extractForm.get('SelectedCommand');
  }
  get SelectedState() {
    return this.extractForm.get('SelectedState');
  }
  get SelectedStateLga() {
    return this.extractForm.get('SelectedStateLga');
  }

  formatCBSDate(date) {
    return new Date(date).toLocaleDateString('en-GB');
  }

  async selectImageSource(name) {
    const buttons = [
      {
        text: 'Take Photo',
        icon: 'camera',
        handler: () => {
          this.addImage(CameraSource.Camera, name);
        },
      },
      {
        text: 'Choose From Gallery',
        icon: 'image',
        handler: () => {
          this.addImage(CameraSource.Photos, name);
        },
      },
    ];

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons,
    });
    await actionSheet.present();
  }
  async addImage(source: CameraSource, name) {
    const image = await Camera.getPhoto({
      quality: 60,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source,
    });

    const blobData = this.b64toBlob(
      image.base64String,
      `image/${image.format}`
    );
    const formData = new FormData();
    formData.append('documents', blobData);
    const loading = await this.loader.create();
    await loading.present();
    this.reqS
      .postFormData(baseEndpoints.cbsUpload, formData)
      .subscribe(async (e: any) => {
        this.extractForm.get(name).setValue(e.data);
        this.extractForm.updateValueAndValidity();
        this.affidavitFile = 'data:image/jpg;base64,' + image.base64String;
        await loading.dismiss();
        this.cdref.detectChanges();
      });
  }

  b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }
}
