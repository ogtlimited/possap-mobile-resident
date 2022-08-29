import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { get } from 'lodash';
import { IonRadioInputOption } from 'src/app/shared/models/component/ion-radio-input-option';
import { IonRadiosConfig } from 'src/app/shared/models/component/ion-radios-config';

@Component({
  selector: 'app-radios',
  templateUrl: './radios.component.html',
  styleUrls: ['./radios.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RadiosComponent,
      multi: true,
    },
  ],
})
export class RadiosComponent implements OnInit, ControlValueAccessor {
  @Input() config: IonRadiosConfig;
  @Input() @Input() set options(opts: Array<IonRadioInputOption>) {
    this.opts = opts ? opts : [];
    this.updateItems();
  }
  items: Array<{
    id: any;
    label: string;
  }> = [];
  private opts: Array<IonRadioInputOption> = [];
  formGroup = this.fb.group({
    radio: this.fb.control(null),
  });

  onChange: (_: any) => void;
  onTouched: () => void;
  value: any;

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) {}

  getFieldValue() {
    const field = this.formGroup.get('radio');
    return field ? field.value : null;
  }
  ngOnInit() {
    this.formGroup.valueChanges.subscribe((vals) => {
      if (this.onChange) {
        this.onChange(this.getFieldValue());
      }
    });
  }

  updateItems() {
    const labelK = get(this.config, 'labelKey', 'label');
    const idK = get(this.config, 'idKey', 'id');
    this.items = this.opts
      .map((v) => {
        return {
          id: get(v, idK, null),
          label: get(v, labelK, null),
        };
      })
      .filter((vv) => {
        return get(vv, 'id', null) !== null;
      });
    this.cdRef.markForCheck();
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.formGroup.setValue({ radio: obj });
    this.formGroup.updateValueAndValidity();
    this.cdRef.markForCheck();
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.formGroup.disable({ emitEvent: true });
    } else {
      this.formGroup.enable({ emitEvent: true });
    }
    this.cdRef.markForCheck();
  }

  get controlI() {
    return this.formGroup.get('radio');
  }

  get controlValue() {
    return this.controlI ? this.controlI.value : null;
  }

  toggleRadio(item) {
    this.controlI.setValue(item.id);
    this.cdRef.markForCheck();
  }
}
