import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormBuilder,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { IonInputConfig } from 'src/app/shared/models/component/ion-input-config';
import { get } from 'lodash';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: InputComponent,
      multi: true,
    },
  ],
})
export class InputComponent implements OnInit, ControlValueAccessor {
  @Output() valueChange: EventEmitter<any> = new EventEmitter();
  @Input() config: IonInputConfig;

  onChange: (_: any) => void;
  onTouched: () => void;
  value: any;
  clearedOnce = false;

  formGroup = this.fb.group({
    input: this.fb.control(null),
  });

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) { }

  writeValue(obj: any, selfW = false): void {
    this.value = obj;
    this.formGroup.setValue({ input: obj });
    this.formGroup.updateValueAndValidity();
    this.cdRef.markForCheck();
    if (!selfW) {
      this.clearedOnce = false;
    }
  }

  registerOnChange(fn: any): void {
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

  getFieldValue() {
    const field = this.formGroup.get('input');
    this.valueChange.emit();
    return field ? field.value : null;
  }
  ngOnInit() {
    this.formGroup.valueChanges.subscribe((vals) => {
      if (this.onChange) {
        this.onChange(this.getFieldValue());
      }
    });
  }

  onMouseDown() {
    // Replace this with the clearOnEdit property on ion-input.
    // If we only want it cleared on input.
    if (this.config.clearOnEdit && !this.clearedOnce) {
      this.formGroup.get('input').reset(null);
      this.clearedOnce = true;
    }
  }

  increment() {
    const max = get(this.config, 'max', null);
    const step = get(this.config, 'step', 1);
    let val = this.getFieldValue();
    val =
      val !== null && val !== undefined && val !== '' ? parseInt(val, 10) : 0;
    const newV = val + step;
    if (val !== null && newV >= max) {
      this.writeValue(max ? max : newV, true);
    } else {
      this.writeValue(newV, true);
    }
  }

  decrement() {
    const min = get(this.config, 'min', 0);
    const step = get(this.config.spinnerConfig.step, 'step', 1);
    let val = this.getFieldValue();
    val =
      val !== null && val !== undefined && val !== '' ? parseInt(val, 10) : 0;
    const newV = val - step;
    if (val !== null && newV <= min) {
      this.writeValue(min, true);
    } else {
      this.writeValue(newV, true);
    }
  }
}
