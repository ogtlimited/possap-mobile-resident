/* eslint-disable @typescript-eslint/naming-convention */
import {
  ActionSheetController,
  LoadingController,
  ModalController,
  Platform,
} from '@ionic/angular';
import { baseEndpoints, miscEndpoint } from './../../../core/config/endpoints';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { RequestService } from './../../../core/request/request.service';
import {
  Component,
  OnChanges,
  Input,
  ChangeDetectionStrategy,
  SimpleChanges,
  EventEmitter,
  Output,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  JsonFormControls,
  JsonFormData,
} from '../../../core/models/form-model';
import { SelectComponent } from '../../select/select.component';

@Component({
  selector: 'app-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnChanges, OnInit {
  @Input() jsonFormData: JsonFormData;
  @Input() serviceId: string;
  @Output() emitForm: EventEmitter<any> = new EventEmitter();
  formCreated: Subject<boolean> = new Subject();
  public myForm: FormGroup;
  fileNames = {};
  message =
    'This modal example uses the modalController to present and dismiss modals.';
  controlApi = {};
  formLabelValues = {};

  constructor(
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef,
    private reqS: RequestService,
    private plt: Platform,
    private actionSheetCtrl: ActionSheetController,
    private modal: ModalController,
    private loader: LoadingController
  ) {}

  ngOnInit() {
    this.myForm = this.fb.group({});
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.jsonFormData.firstChange) {
      this.createForm(this.jsonFormData.controls);
    }
  }
  createForm(controls: JsonFormControls[]) {
    for (const control of controls) {
      const validatorsToAdd = [];
      for (const [key, value] of Object.entries(control.validators)) {
        switch (key) {
          case 'min':
            validatorsToAdd.push(Validators.min(value));
            break;
          case 'max':
            validatorsToAdd.push(Validators.max(value));
            break;
          case 'required':
            if (value && control.showIf === undefined) {
              validatorsToAdd.push(Validators.required);
            }
            break;
          case 'requiredTrue':
            if (value) {
              validatorsToAdd.push(Validators.requiredTrue);
            }
            break;
          case 'email':
            if (value) {
              validatorsToAdd.push(Validators.email);
            }
            break;
          case 'minLength':
            validatorsToAdd.push(Validators.minLength(value));
            break;
          case 'maxLength':
            validatorsToAdd.push(Validators.maxLength(value));
            break;
          case 'pattern':
            validatorsToAdd.push(Validators.pattern(value));
            break;
          case 'nullValidator':
            if (value) {
              validatorsToAdd.push(Validators.nullValidator);
            }
            break;
          default:
            break;
        }
      }
      if (control.type === 'file') {
        this.fileNames[control.name] = '';
      }
      if (control.api) {
        this.controlApi[control.name] = control.placeholder;
      }
      this.myForm.addControl(
        control.name,
        this.fb.control(control.value, validatorsToAdd)
      );

      this.formCreated.next(true);
    }
  }

  onSubmit() {
    const { value } = this.myForm;
    const dateTpes = this.jsonFormData.controls
      .filter((e) => e.type === 'date')
      .map((t) => t.name);
    dateTpes.forEach((e) => {
      if (value[e]) {
        value[e] = new Date(value[e]).toLocaleDateString('en-GB');
      }
    });
    const obj = {
      mainValue: value,
      labelValue: this.formLabelValues,
    };
    this.emitForm.emit(obj);
  }
  canRender(name, control) {
    const field = this.jsonFormData.controls.filter((e) => e.name === name)[0];

    if (!field.showIf) {
      return true;
    } else {
      if (
        typeof this.myForm.value[control?.showIf?.value] === 'string' ||
        typeof this.myForm.value[control?.showIf?.value] === 'boolean'
      ) {
        const result =
          this.myForm.value[control?.showIf?.value] === control?.showIf?.equals;
        if (result && control.validators.required) {
          this.myForm.addValidators(Validators.requiredTrue);
          // this.myForm.updateValueAndValidity();
        }
        return result;
      } else if (
        typeof this.myForm.value[control?.showIf?.value] === 'object'
      ) {
        const result = this.myForm.value[control?.showIf?.value].includes(
          control?.showIf?.equals
        );
        if (result && control.validators.required) {
          this.myForm.addValidators(Validators.requiredTrue);
          // this.myForm.updateValueAndValidity();
        }
        return result;
      }

      return false;
    }
  }

  getOptions(control) {
    if (control.options) {
      return control.options;
    } else {
      // const data = this.fetchData(control);
    }
  }
  async openModal(control) {
    const modal = await this.modal.create({
      component: SelectComponent,
      cssClass: 'select-modal',
      breakpoints: [0.25],
      componentProps: {
        control,
        jsonFormData: this.jsonFormData,
        myForm: this.myForm,
        serviceId: this.serviceId,
      },
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    this.controlApi[control.name] = data.label;
    this.formLabelValues[control.name] = data.label;
    this.myForm.patchValue({
      [control.name]: data.value,
    });
    this.cdref.detectChanges();
  }

  selectApiChange(event, control) {
    event.preventDefault();
    this.openModal(control);
  }

  setLabelValue(key, event) {
    console.log(event);
    this.formLabelValues = {
      ...this.formLabelValues,
      [key]: event.detail.value,
    };
  }
  setSelectLabelValue(event, options, key) {
    const { value } = event.detail;
    if(Array.isArray(value)){
      const val = [];
      options.forEach(e => {
        if(value.includes(e.key)){
          val.push(e.value);
        }
      });
      this.formLabelValues = {
        ...this.formLabelValues,
        [key]: val,
      };

    }else{
      const v = options.filter((e) => e.key === value)[0];
      this.formLabelValues = {
        ...this.formLabelValues,
        [key]: v.value,
      };
    }
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
    this.reqS
      .postFormData(baseEndpoints.cbsUpload, formData)
      .subscribe(async (e: any) => {
        this.myForm.controls[name].setValue(e.data);
        this.myForm.updateValueAndValidity();
        this.fileNames[name] = 'data:image/jpg;base64,' + image.base64String;

        await loading.dismiss();
        this.cdref.detectChanges();
      });
    // this.api.uploadImage(blobData, imageName, image.format).subscribe((newImage: ApiImage) => {
    //   this.images.push(newImage);
    // });
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

  dataURIToBlob(dataURI: string) {
    const splitDataURI = dataURI.split(',');
    const byteString =
      splitDataURI[0].indexOf('base64') >= 0
        ? atob(splitDataURI[1])
        : decodeURI(splitDataURI[1]);
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  dateFormat(v, name) {
    const d = new Date(v.value);
    if (d instanceof Date) {
      const date = d.toLocaleDateString();
      this.myForm.get(name).setValue(date);
    }
  }
}
