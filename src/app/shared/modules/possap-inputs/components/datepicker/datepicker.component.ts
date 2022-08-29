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
import { IonDateTimeConfig } from 'src/app/shared/models/component/ion-datetime-config';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: DatepickerComponent,
      multi: true,
    },
  ],
})
export class DatepickerComponent implements OnInit, ControlValueAccessor {
  @Input()
  config: IonDateTimeConfig;

  onChange: (_: any) => void;
  onTouched: () => void;
  value: any;

  formGroup = this.fb.group({
    date: this.fb.control(null),
  });

  constructor(private fb: FormBuilder, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    this.formGroup.valueChanges.subscribe((vals) => {
      if (this.onChange) {
        this.onChange(this.getFieldValue());
      }
    });
  }

  getFieldValue() {
    const field = this.formGroup.get('date');
    return field ? field.value : null;
  }

  writeValue(obj: any): void {
    this.value = obj;
    this.formGroup.setValue({ date: obj });
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
}
