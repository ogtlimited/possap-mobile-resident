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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { IEGSFormData, IGeneric } from 'src/app/core/models/ResponseModel';
import { EgsService } from 'src/app/core/services/egs/egs.service';
import { GlobalService } from 'src/app/core/services/global/global.service';
import { DateValidator } from './date-validator';

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
  formLabelValues = {};
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
  showCommandTactical = false;
  showCommandConventional = false;
  today = new Date();
  minimumDate = new Date();
  endDateError = false;

  constructor(
    private fb: FormBuilder,
    private egs: EgsService,
    private globalS: GlobalService,
    private loader: LoadingController
  ) {}

  ngOnInit() {
    this.minimumDate.setDate(this.today.getDate() + 1);
    this.egsForm = this.fb.group({
      ServiceCategory: ['', Validators.required],
      CategoryType: ['', Validators.required],
      SelectedOriginState: [0],
      SelectedOriginLGA: [0],
      AddressOfOriginLocation: [''],
      SelectedState: ['', Validators.required],
      SelectedStateLGA: ['', Validators.required],
      Address: ['', Validators.required],
      StartDate: ['', [Validators.required, DateValidator()]],
      EndDate: ['', Validators.required],
      SelectedCommandType: ['', Validators.required],
      SelectedTacticalSquad: [0],
      SelectedCommand: ['', Validators.required],
    });
    this.ServiceCategory.valueChanges.subscribe((v) => {
      const labels = this.ServiceCategoryOptions.filter((e) => e.Id === v)[0];
      console.log(labels);
      this.formLabelValues = {
        ...this.formLabelValues,
        ServiceCategory: labels.Name,
      };
      this.CategoryTypeOptions = this.getFieldOptions(v);
      this.CategoryType.setValue('');
      this.SelectedOriginState.setValue(0);
      this.SelectedOriginLGA.setValue(0);
      this.AddressOfOriginLocation.setValue('');
    });
    this.CategoryType.valueChanges.subscribe((v) => {
      console.log(v);
      if (v !== '') {
        const labels = this.CategoryTypeOptions.filter((e) => e.Id === v)[0];
        console.log(labels);
        this.formLabelValues = {
          ...this.formLabelValues,
          SelectedCategoryType: labels.Name,
        };
        this.showEscortService = labels.Name.includes('Escort') ? true : false;
        if (this.showEscortService) {
          this.SelectedOriginState.setValidators([Validators.required]);
          this.SelectedOriginLGA.setValidators([Validators.required]);
          this.AddressOfOriginLocation.setValidators([Validators.required]);
          this.updateOriginFieldsValidity();
        } else {
          this.SelectedOriginState.clearValidators();
          this.SelectedOriginLGA.clearValidators();
          this.AddressOfOriginLocation.clearValidators();
          this.updateOriginFieldsValidity();
        }
      }
    });
    this.SelectedCommandType.valueChanges.subscribe((v) => {
      const labels = this.CommandTypeOptions.filter((e) => e.Id === v)[0];
      console.log(v, labels, this.CommandTypeOptions);
      this.formLabelValues = {
        ...this.formLabelValues,
        CommandType: labels.Name,
      };
      this.showCommandTactical = labels.Name === 'Tactical' ? true : false;
      if (labels.Name === 'Tactical') {
        this.showCommandTactical = true;
        this.showCommandConventional = false;
        this.SelectedTacticalSquad.setValidators([Validators.required]);
        this.SelectedTacticalSquad.updateValueAndValidity();
      } else {
        this.showCommandConventional = true;
        this.showCommandTactical = false;
        this.SelectedTacticalSquad.clearValidators();
        this.SelectedTacticalSquad.setValue(0);
        this.SelectedTacticalSquad.updateValueAndValidity();
      }
      this.SelectedCommand.setValue('');
      this.fetchTacticalSquad(this.user, v);
    });
    this.SelectedTacticalSquad.valueChanges.subscribe((v) => {
      if (v !== 0) {
        const labels = this.TacticalSquadOptions.filter((e) => e.Id === v)[0];
        console.log(v, labels, this.CommandTypeOptions);
        // this.showCommandTactical = labels.Name === 'Tactical' ? true : false;

        this.fetchNextLevelCommand(this.user, labels.Code, labels.Name);
      }
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
      if (state !== 0) {
        this.OriginLGAOptions = this.OriginStateOptions.filter(
          (val) => val.Id === state
        )[0]?.LGAs;
        console.log(this.LGAOptions);
      }
    });
    this.SelectedStateLGA.valueChanges.subscribe((val) => {
      console.log(val);
      if (this.showCommandConventional) {
        this.SelectedCommand.setValue('');
      }
      this.fetchStateFormation(this.user, this.SelectedState.value, val, '');
      console.log(this.LGAOptions);
    });
    this.SelectedCommand.valueChanges.subscribe((v) => {
      if (v !== 0 && v !== '') {
        const label = this.CommandOptions.filter((i) => i.Id === v)[0];
        this.formLabelValues = {
          ...this.formLabelValues,
          Command: label.Name,
        };
        console.log(label);
      }
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
  async fetchStateFormation(user, stateId, lgaId, name) {
    const loading = await this.loader.create();
    await loading.present();
    this.egs
      .getStateFormation(user, stateId, lgaId)
      .subscribe((res: IGeneric) => {
        console.log(res);
        this.CommandOptions = res.data.ResponseObject.map((e) => ({
          ...e,
          Name: e.Name.includes(name) ? e.Name.split(name + ' -')[1] : e.Name,
        }));
        loading.dismiss();
      });
  }

  onSubmit() {
    const { ServiceCategory, CategoryType, ...obj } = this.egsForm.value;
    const formVal = {
      ...obj,
      Reason: '',
      // StartDate: new Date(StartDate).toLocaleDateString('en-GB'),
      // EndDate: new Date(EndDate).toLocaleDateString('en-GB'),
      SelectedEscortServiceCategories: ServiceCategory + ',' + CategoryType,
    };

    this.emitForm.emit({
      values: formVal,
      labelValues: this.formLabelValues,
    });
    console.log(formVal);
  }

  submitEstimate() {}

  validateEndDate() {
    const start = new Date(this.StartDate.value);
    const end = new Date(this.EndDate.value);
    this.endDateError = end < start ? true : false;
    console.log(this.endDateError, 'end date');
  }

  updateOriginFieldsValidity() {
    this.SelectedOriginState.setValue(0);
    this.SelectedOriginLGA.setValue(0);
    this.AddressOfOriginLocation.setValue(0);
    this.SelectedOriginState.updateValueAndValidity();
    this.SelectedOriginLGA.updateValueAndValidity();
    this.AddressOfOriginLocation.updateValueAndValidity();
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
