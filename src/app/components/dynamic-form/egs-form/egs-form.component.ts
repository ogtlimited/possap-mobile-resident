/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { IEGSFormData, IGeneric } from 'src/app/core/models/ResponseModel';
import { EgsService } from 'src/app/core/services/egs/egs.service';
import { GlobalService } from 'src/app/core/services/global/global.service';

@Component({
  selector: 'app-egs-form',
  templateUrl: './egs-form.component.html',
  styleUrls: ['./egs-form.component.scss'],
})
export class EgsFormComponent implements OnInit {
  egsForm: FormGroup;
  @Input() formData: IEGSFormData;
  @Input() user;
  @Output() emitForm: EventEmitter<any> = new EventEmitter();
  ServiceCategoryOptions = [];
  CategoryTypeOptions = [];
  CommandTypeOptions = [];
  CommandOptions = [];
  TacticalSquadOptions = [];
  OriginStateOptions = [];
  StateOptions = [];
  OriginLGAOptions = [];
  LGAOptions = [];
  showEscortService = false;
  showCommand = false;
  constructor(
    private fb: FormBuilder,
    private egs: EgsService,
    private globalS: GlobalService,
    private loader: LoadingController
  ) {}

  ngOnInit() {
    this.egsForm = this.fb.group({
      ServiceCategory: [''],
      CategoryType: [''],
      SelectedOriginState: [''],
      SelectedOriginLGA: [''],
      AddressOfOriginLocation: [''],
      SelectedState: [''],
      SelectedStateLGA: [''],
      Address: [''],
      StartDate: [''],
      EndDate: [''],
      SelectedCommandType: [''],
      SelectedTacticalSquad: [''],
      SelectedCommand: [''],
    });
    this.ServiceCategory.valueChanges.subscribe((v) => {
      this.CategoryTypeOptions = this.getFieldOptions(v);
      this.CategoryType.setValue('');
    });
    this.CategoryType.valueChanges.subscribe((v) => {
      console.log(v);
      if (v !== '') {
        const labels = this.CategoryTypeOptions.filter((e) => e.Id === v)[0];
        console.log(labels);
        this.showEscortService = labels.Name.includes('Escort') ? true : false;
      }
    });
    this.SelectedCommandType.valueChanges.subscribe((v) => {
      const labels = this.CommandTypeOptions.filter((e) => e.Id === v)[0];
      console.log(v, labels, this.CommandTypeOptions);
      this.showCommand = labels.Name === 'Tactical' ? true : false;

      this.fetchTacticalSquad(this.user, v);
    });
    this.SelectedTacticalSquad.valueChanges.subscribe((v) => {
      const labels = this.TacticalSquadOptions.filter((e) => e.Id === v)[0];
      // console.log(v, labels, this.CommandTypeOptions);
      // this.showCommand = labels.Name === 'Tactical' ? true : false;

      this.fetchNextLevelCommand(this.user, labels.Code, labels.Name);
    });
    this.globalS.statesLgas$.subscribe((e) => {
      this.StateOptions = e;
      this.OriginStateOptions = e;
    });
    this.SelectedState.valueChanges.subscribe((state) => {
      console.log(state);
      this.LGAOptions = this.StateOptions.filter(
        (val) => val.Id === state
      )[0].LGAs;
      console.log(this.LGAOptions);
    });
    this.SelectedOriginState.valueChanges.subscribe((state) => {
      console.log(state);
      this.OriginLGAOptions = this.OriginStateOptions.filter(
        (val) => val.Id === state
      )[0].LGAs;
      console.log(this.LGAOptions);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.formData);
    //if (!changes.formData.firstChange) {
      console.log(this.formData);
      this.CommandTypeOptions = this.formData.CommandTypes;
      this.ServiceCategoryOptions = this.getFieldOptions(0);
    //}
  }

  getFieldOptions(v) {
    return this.formData.EscortServiceCategories.filter(
      (e) => e.ParentId === v
    );
  }
  async fetchTacticalSquad(user, squadId) {
    const loading = await this.loader.create();
    await loading.present();
    this.egs.getTacticalSquad(user, squadId).subscribe((res: IGeneric) => {
      console.log(res);
      this.TacticalSquadOptions = res.data.ResponseObject.map((e) => ({
        ...e,
        Name: e.Name.split('- ')[1],
      }));
      loading.dismiss();
    });
  }
  async fetchNextLevelCommand(user, commandId, name) {
    const loading = await this.loader.create();
    await loading.present();
    this.egs.getNextLevelCommand(user, commandId).subscribe((res: IGeneric) => {
      console.log(res);
      this.CommandOptions = res.data.ResponseObject.map((e) => ({
        ...e,
        Name: e.Name.includes(name) ? e.Name.split(name + ' -')[1] : e.Name,
      }));
      loading.dismiss();
    });
  }

  onSubmit() {
    const { ServiceCategory, CategoryType,StartDate, EndDate, ...obj } = this.egsForm.value;
    const formVal = {
      ...obj,
      Reason: '',
      StartDate: new Date(StartDate).toLocaleDateString('en-GB'),
      EndDate: new Date(EndDate).toLocaleDateString('en-GB'),
      SelectedEscortServiceCategories: ServiceCategory + ',' + CategoryType,
    };
    this.emitForm.emit(formVal);
    console.log(formVal);
  }

  get SelectedCommand() {
    return this.egsForm.get('SelectedCommand');
  }
  get SelectedTacticalSquad() {
    return this.egsForm.get('SelectedTacticalSquad');
  }
  get SelectedCommandType() {
    return this.egsForm.get('SelectedCommandType');
  }
  get EndDate() {
    return this.egsForm.get('EndDate');
  }
  get StartDate() {
    return this.egsForm.get('StartDate');
  }
  get Address() {
    return this.egsForm.get('Address');
  }
  get SelectedStateLGA() {
    return this.egsForm.get('SelectedStateLGA');
  }
  get SelectedState() {
    return this.egsForm.get('SelectedState');
  }
  get AddressOfOriginLocation() {
    return this.egsForm.get('AddressOfOriginLocation');
  }
  get SelectedOriginLGA() {
    return this.egsForm.get('SelectedOriginLGA');
  }
  get SelectedOriginState() {
    return this.egsForm.get('SelectedOriginState');
  }
  get CategoryType() {
    return this.egsForm.get('CategoryType');
  }
  get ServiceCategory() {
    return this.egsForm.get('ServiceCategory');
  }
}
