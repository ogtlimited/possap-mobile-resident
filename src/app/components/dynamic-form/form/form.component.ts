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
  @Output() emitForm: EventEmitter<any> = new EventEmitter();
  formCreated: Subject<boolean> = new Subject();
  public myForm: FormGroup;
  message =
    'This modal example uses the modalController to present and dismiss modals.';

  constructor(
    private fb: FormBuilder,
    private cdref: ChangeDetectorRef,
    private reqS: RequestService,
    private plt: Platform,
    private actionSheetCtrl: ActionSheetController,
    private modal: ModalController,
    private loader: LoadingController
  ) {
    // console.log(this)
  }
  ngOnInit() {
    this.myForm = this.fb.group({});
    this.formCreated.subscribe((data) => {
      // console.log(this.myForm.controls);
      if (data) {
        // console.log(this)
        // this.myForm.valueChanges.subscribe((val) => {
        //   console.log(val);
        // });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    if (!changes.jsonFormData.firstChange) {
      this.createForm(this.jsonFormData.controls);
    }
  }
  createForm(controls: JsonFormControls[]) {
    console.log(controls);
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
            if (value) {
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
      this.myForm.addControl(
        control.name,
        this.fb.control(control.value, validatorsToAdd)
      );

      this.formCreated.next(true);
    }
  }

  onSubmit() {
    console.log('Form valid: ', this.myForm.valid);
    this.emitForm.emit(this.myForm.value);
    console.log('Form values: ', this.myForm.value);
  }
  canRender(name, control) {
    const field = this.jsonFormData.controls.filter((e) => e.name === name)[0];
    if (!field.showIf) {
      return true;
    } else {
      return (
        this.myForm.value[control?.showIf?.value] === control?.showIf?.equals ||
        this.myForm.value[control?.showIf?.value].includes(
          control?.showIf?.equals
        )
      );
      return false;
    }
  }

  getOptions(control) {
    if (control.options) {
      return control.options;
    } else {
      // const data = this.fetchData(control);
      // console.log(data);
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
      },
    });
    modal.present();

    const { data } = await modal.onWillDismiss();
    this.myForm.patchValue({
      [control.name]: data,
    });
    console.log(data);
  }

  selectChange(control) {
    this.openModal(control);
    console.log(this.jsonFormData);
    console.log(control);
    console.log(this.myForm.value);
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
    const imageName = 'Give me a name';
    const formData = new FormData();
    formData.append('documents', blobData);
    const loading = await this.loader.create();
    await loading.present();
    this.reqS
      .post(miscEndpoint.mediaUpload, formData)
      .subscribe(async (e: any) => {
        console.log(e.data, name);
        this.myForm.controls[name].setValue(e.data);
        this.myForm.updateValueAndValidity();
        console.log(this.myForm.value);
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
}
