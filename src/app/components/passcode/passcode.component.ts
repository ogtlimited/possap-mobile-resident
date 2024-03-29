import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-passcode',
  templateUrl: './passcode.component.html',
  styleUrls: ['./passcode.component.scss'],
})
export class PasscodeComponent implements OnInit {
  @Output() doPassForm: EventEmitter<FormGroup> = new EventEmitter();
  @Input() errorLogin: string | null | boolean = false;
  @Input() reset: string | null | boolean;
  @Input() submitOtp;
  passForm: FormGroup;
  savePin = [];
  digitsLength = 0;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.passForm = this.formBuilder.group({
      passcode: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });

    this.passForm.valueChanges.subscribe((value) => {
      if (this.digitsLength === 6) {
        this.emitForm();
      }
    });
  }

  changeInput(passCode: string) {
    console.log(passCode);
    this.digitsLength = passCode ? passCode.length : 0;
    /*  */
    if (this.digitsLength === 6) {
      this.emitForm();
    }
    if (this.digitsLength > 6) {
      const value = this.passCode.value ? this.passCode.value : '';
      try {
        this.passCode.setValue(value.substring(0, 6), { emitEvent: false });
      } catch (e) {}
    }
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  get passCode() {
    return this.passForm.get('passcode');
  }
  clickingInput(pinKey: any) {
    console.log(pinKey);
    switch (pinKey) {
      case 'backIcon':
        if (this.savePin.length > 0) {
          this.savePin.pop();
        }
        break;
      default:
        if (this.savePin.length < 6) {
          this.savePin.push(pinKey);
        }
        break;
    }
    this.digitsLength = this.savePin.length;
    if (this.digitsLength === 6) {
      this.passCode.setValue(this.savePin.join(''), { emitEvent: true });
      if (this.reset) {
        this.submitOtp(this.passCode.value);
      }
    }
  }
  public emitForm(): void {
    this.doPassForm.emit(this.passForm);
  }
  public resetOtp(): void {
    this.doPassForm.emit(this.passForm);
  }
}
