/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CmrService } from 'src/app/core/services/cmr/cmr.service';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-cmr-form',
  templateUrl: './cmr-form.component.html',
  styleUrls: ['./cmr-form.component.scss'],
})
export class CmrFormComponent implements OnInit {
  title = 'Central Motor Registry';
  cmrForm: FormGroup;
  crrYear = new Date().getFullYear() + 1 - 1960;
  regProofFile = null;
  regPaperFile = null;
  yearList = new Array(this.crrYear)
    .fill(0)
    .map((e, i) => 1960 + i)
    .reverse();
  serviceId = 2;
  carMake: any;
  carModels: any;
  jsonFormData;
  showForm = true;
  invoiceDetails;
  formData = {};
  owner;
  type = '';
  serviceCharge: any;
  serviceName = 'CMR';
  constructor(
    private fb: FormBuilder,
    private cmr: CmrService,
    private loader: LoadingController,
    private actionSheetCtrl: ActionSheetController,
    private authS: AuthService,
    private route: ActivatedRoute
  ) {}

  ionViewWillEnter() {
    console.log('enter');
    this.cmrForm.reset();
    this.regPaperFile = '';
    this.regProofFile = '';
    this.showForm = true;
  }

  ngOnInit() {
    this.showForm = true;
    this.authS.currentUser$.subscribe((user) => {
      this.owner = user;
    });
    this.cmr.getCarMake().subscribe((res) => {
      this.carMake = res.Results;
      console.log(res.Results);
    });
    console.log(this.yearList);
    this.cmrForm = this.fb.group({
      vehMake: ['', Validators.required],
      vehColor: ['', Validators.required],
      year: ['', Validators.required],
      model: ['', Validators.required],
      regProof: ['', Validators.required],
      regPapers: ['', Validators.required],
    });
    this.year.valueChanges.subscribe((v) => {
      const make = this.vehMake.value;
      this.cmr.getCarModel(make, v).subscribe((res) => {
        this.carModels = res.Results;
        console.log(res);
      });
    });

    this.route.queryParams.subscribe((params) => {
      this.serviceId = params.service;
      console.log(this.serviceId, 'SERVICEID');
      this.title = params.title;
      this.type = params.type;
    });
  }

  onSubmit() {
    this.formData = this.cmrForm.value;
    this.invoiceDetails = {
      AmountDue: 6000,
      InvoiceItemsSummaries: [{ UnitAmount: 5000 }, { UnitAmount: 1000 }],
    };
    this.showForm = false;
    console.log(this.cmrForm.value);
  }

  get vehMake() {
    return this.cmrForm.get('vehMake');
  }
  get vehColor() {
    return this.cmrForm.get('vehColor');
  }
  get year() {
    return this.cmrForm.get('year');
  }
  get regProof() {
    return this.cmrForm.get('regProof');
  }
  get model() {
    return this.cmrForm.get('model');
  }
  get regPapers() {
    return this.cmrForm.get('regPapers');
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

    // Only allow file selection inside a browser
    // if (!this.plt.is('hybrid')) {
    //   buttons.push({
    //     text: 'Choose a File',
    //     icon: 'attach',
    //     handler: () => {
    //       this.fileInput.nativeElement.click();
    //     }
    //   });
    // }

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
    setTimeout(() => {
      console.log(image);
      if (name === 'regProof') {
        this.regProofFile = 'data:image/jpg;base64,' + image.base64String;
        this.regProof.setValue(image.base64String);
      } else {
        this.regPaperFile = 'data:image/jpg;base64,' + image.base64String;
        this.regPapers.setValue(image.base64String);
      }
      console.log(this.cmrForm.value);
      this.cmrForm.updateValueAndValidity();
      loading.dismiss();
    }, 2000);
    // this.reqS
    //   .postFormData(baseEndpoints.cbsUpload, formData)
    //   .subscribe(async (e: any) => {
    //     this.myForm.controls[name].setValue(e.data);
    //     this.myForm.updateValueAndValidity();

    //     await loading.dismiss();
    //     this.cdref.detectChanges();
    //   });
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
