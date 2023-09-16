/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  LoadingController,
  ModalController,
  ActionSheetController,
} from '@ionic/angular';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { baseEndpoints } from 'src/app/core/config/endpoints';
import { IGenericResponse } from 'src/app/core/models/ResponseModel';
import { RequestService } from 'src/app/core/request/request.service';

import { GlobalService } from 'src/app/core/services/global/global.service';
import { SelectSearchModalComponent } from '../../select-search-modal/select-search-modal.component';

@Component({
  selector: 'app-pcc-form',
  templateUrl: './pcc-form.component.html',
  styleUrls: ['./pcc-form.component.scss'],
})
export class PccFormComponent implements OnInit {
  characterCertificateForm: FormGroup;
  @Output() emitForm: EventEmitter<any> = new EventEmitter();
  serviceId: any;
  title: any;
  type: any;
  serviceName: any;
  RequestTypes = [];
  ReasonsForInquiryOptions = [];
  Countries = [];
  StateLGAs = [];
  Commands = [];
  tempForm: any = {};
  labelForm: any = {};
  minDate = new Date().getFullYear() - 14;
  fileNames = {
    intpassportdatapagefile: '',
    passportphotographfile: '',
  };
  isDiaspora = false;
  sample = {
    ServiceId: '4',
    RequestType: '1',
    CharacterCertificateReasonForInquiry: '2',
    SelectedCountryOfOrigin: '162',
    PlaceOfBirth: 'Jos',
    DateOfBirth: '18/06/1992',
    DestinationCountry: '162',
    SelectedCountryOfPassport: '162',
    PassportNumber: 'A02936977',
    PlaceOfIssuance: 'Abuja',
    DateOfIssuance: '12/06/2022',
    PreviouslyConvicted: false,
    PreviousConvictionHistory: '',
    passportphotographfile: '1693947094579.png',
    intpassportdatapagefile: '1693947104164.jpeg',
    SelectedState: 37,
    SelectedCommand: 28,
    SelectedStateOfOrigin: 20,
    ReasonForInquiryValue: 'Employment',
  };
  showForm: boolean;
  invoiceDetails: any;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private actionSheetCtrl: ActionSheetController,
    private globalS: GlobalService,
    private loader: LoadingController,
    private reqS: RequestService,
    private modal: ModalController,
    private cdref: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.characterCertificateForm = this.fb.group({
      CharacterCertificateReasonForInquiry: ['', Validators.required],
      DateOfBirth: ['', [Validators.required, this.birthDateValidator]],
      DateOfIssuance: ['', [Validators.required, this.currentDateValidator]],
      DestinationCountry: [''],
      PassportNumber: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(9),
          Validators.maxLength(9),
        ]),
      ],
      PlaceOfBirth: ['', Validators.required],
      PlaceOfIssuance: ['', Validators.required],
      PreviousConvictionHistory: [''],
      PreviouslyConvicted: [false],
      ReasonForInquiryValue: ['', Validators.required],
      RequestType: [''],
      SelectedCommand: [''],
      SelectedCountryOfOrigin: ['', Validators.required],
      SelectedCountryOfPassport: ['', Validators.required],
      SelectedState: [''],
      SelectedStateOfOrigin: [''],
      ServiceId: ['', Validators.required],
      SelectedCountryOfResidence: [''],
      passportphotographfile: ['', Validators.required],
      intpassportdatapagefile: ['', Validators.required],
      proofOfResidenceFile: [''],
    });
    this.CharacterCertificateReasonForInquiry.valueChanges.subscribe((e) => {
      const d = this.ReasonsForInquiryOptions.filter((c) => c.Id === e)[0];
      this.ReasonForInquiryValue.setValue(d.Name);
      this.labelForm.CharacterCertificateReasonForInquiry = d.Name;
    });
    this.RequestType.valueChanges.subscribe((e) => {
      const d = this.RequestTypes.filter((c) => c.Id === e)[0];
      this.labelForm.RequestType = d.Name;
    });
    this.PreviouslyConvicted.valueChanges.subscribe((e) => {
      if (e === 'true') {
        this.PreviousConvictionHistory.setValidators([Validators.required]);
      } else {
        this.PreviousConvictionHistory.clearValidators();
      }
      this.characterCertificateForm.updateValueAndValidity();
    });
    this.loadData();
  }

  async onSubmit() {
    if (this.characterCertificateForm.valid) {
      const { value } = this.characterCertificateForm;
      value.DateOfBirth = new Date(value.DateOfBirth).toLocaleDateString(
        'en-GB'
      );
      value.DateOfIssuance = new Date(value.DateOfIssuance).toLocaleDateString(
        'en-GB'
      );
      const obj = {
        mainValue: {
          ...value,
          ...this.tempForm,
        },
        labelValue: {
          ...value,
          ...this.labelForm,
        },
      };
      console.log(obj);
      this.emitForm.emit(obj);
    }
  }

  loadData() {
    this.route.queryParams.subscribe((params) => {
      this.serviceId = params.service;
      this.characterCertificateForm.get('ServiceId').setValue(params.service);
      this.title = params.title;
      console.log(params);
      if (this.title.toLowerCase().includes('diaspora')) {
        this.isDiaspora = true;
        this.characterCertificateForm
          .get('proofOfResidenceFile')
          .setValidators([Validators.required]);
        this.characterCertificateForm
          .get('SelectedCountryOfResidence')
          .setValidators([Validators.required]);
        this.characterCertificateForm.updateValueAndValidity();
      } else {
        this.characterCertificateForm
          .get('SelectedState')
          .setValidators([Validators.required]);
        this.characterCertificateForm
          .get('SelectedStateOfOrigin')
          .setValidators([Validators.required]);
        this.characterCertificateForm
          .get('SelectedCommand')
          .setValidators([Validators.required]);
        this.characterCertificateForm
          .get('PreviouslyConvicted')
          .setValidators([Validators.required]);
        this.characterCertificateForm
          .get('RequestType')
          .setValidators([Validators.required]);
        this.characterCertificateForm.updateValueAndValidity();
      }
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
  }

  currentDateValidator(control) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();

    if (selectedDate > currentDate) {
      return { invalidDate: true };
    }

    return null;
  }
  birthDateValidator(control) {
    const selectedDate = new Date(control.value);
    const currentDate = new Date();

    if (currentDate.getFullYear() - selectedDate.getFullYear() < 14) {
      return { invalidBirthDate: true };
    }

    return null;
  }

  async getFormData() {
    const endpoint = baseEndpoints.pccFormdata;
    const loading = await this.loader.create();
    await loading.present();
    this.reqS.get(endpoint).subscribe((data: IGenericResponse) => {
      console.log(data.ResponseObject);
      loading.dismiss();
      this.StateLGAs = data.ResponseObject.StateLGAs;
      this.RequestTypes = data.ResponseObject.RequestTypes;
      this.Countries = data.ResponseObject.Countries;

      this.ReasonsForInquiryOptions =
        data.ResponseObject.CharacterCertificateReasonsForInquiry;
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
    if (data) {
      this.tempForm[field] = data?.Id;
      this.characterCertificateForm.get(field).setValue(data?.Name);
      if (field === 'SelectedState') {
        this.fetchActiveCommands(data.Id);
      }
    }
    this.cdref.detectChanges();
  }

  async fetchActiveCommands(state) {
    const res: any = await this.reqS
      .post(baseEndpoints.helper + '/state-scid', {
        state,
        serviceId: this.serviceId,
      })
      .toPromise();
    if (res.data) {
      const mapped = res.data.map((e) => ({ Name: e.label, Id: e.value }));
      this.openModal('Select State of Origin', mapped, 'SelectedCommand');
    }
  }

  get CharacterCertificateReasonForInquiry() {
    return this.characterCertificateForm.get(
      'CharacterCertificateReasonForInquiry'
    );
  }
  get DateOfBirth() {
    return this.characterCertificateForm.get('DateOfBirth');
  }
  get DateOfIssuance() {
    return this.characterCertificateForm.get('DateOfIssuance');
  }
  get DestinationCountry() {
    return this.characterCertificateForm.get('DestinationCountry');
  }
  get PassportNumber() {
    return this.characterCertificateForm.get('PassportNumber');
  }
  get PlaceOfBirth() {
    return this.characterCertificateForm.get('PlaceOfBirth');
  }
  get PlaceOfIssuance() {
    return this.characterCertificateForm.get('PlaceOfIssuance');
  }
  get PreviousConvictionHistory() {
    return this.characterCertificateForm.get('PreviousConvictionHistory');
  }
  get PreviouslyConvicted() {
    return this.characterCertificateForm.get('PreviouslyConvicted');
  }
  get ReasonForInquiryValue() {
    return this.characterCertificateForm.get('ReasonForInquiryValue');
  }
  get RequestType() {
    return this.characterCertificateForm.get('RequestType');
  }
  get SelectedCommand() {
    return this.characterCertificateForm.get('SelectedCommand');
  }
  get SelectedCountryOfOrigin() {
    return this.characterCertificateForm.get('SelectedCountryOfOrigin');
  }
  get SelectedCountryOfPassport() {
    return this.characterCertificateForm.get('SelectedCountryOfPassport');
  }
  get SelectedState() {
    return this.characterCertificateForm.get('SelectedState');
  }
  get SelectedStateOfOrigin() {
    return this.characterCertificateForm.get('SelectedStateOfOrigin');
  }
  get passportphotographfile() {
    return this.characterCertificateForm.get('passportphotographfile');
  }
  get intpassportdatapagefile() {
    return this.characterCertificateForm.get('intpassportdatapagefile');
  }
  get proofOfResidenceFile() {
    return this.characterCertificateForm.get('proofOfResidenceFile');
  }
  get SelectedCountryOfResidence() {
    return this.characterCertificateForm.get('SelectedCountryOfResidence');
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
    //if (await this.globalS.getCameraPermission()) {
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
          this.characterCertificateForm.get(name).setValue(e.data);
          this.characterCertificateForm.updateValueAndValidity();
          this.fileNames[name] = 'data:image/jpg;base64,' + image.base64String;
          await loading.dismiss();
          this.cdref.detectChanges();
        });
   // }
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
