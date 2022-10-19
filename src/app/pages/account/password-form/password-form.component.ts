/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { matchValidator } from '../../../providers/confirm.validator';

@Component({
  selector: 'app-password-form',
  templateUrl: './password-form.component.html',
  styleUrls: ['./password-form.component.scss'],
})
export class PasswordFormComponent implements OnInit {
  passwordForm: FormGroup;
  hide = false;
  @Output() emitForm: EventEmitter<any> = new EventEmitter();
  constructor(private fb: FormBuilder, private modal: ModalController) {}

  ngOnInit() {
    this.passwordForm = this.fb.group({
      password: ['', [Validators.required]],
      new_password: [
        '',
        [Validators.required, Validators.minLength(6)],
        matchValidator('confirm_password', true),
      ],
      confirm_password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          matchValidator('new_password'),
        ],
      ],
    });
  }

  get password() {
    return this.passwordForm.get('password');
  }

  get newPassword() {
    return this.passwordForm.get('new_password');
  }
  get confirmPassword() {
    return this.passwordForm.get('confirm_password');
  }

  changePassword() {
    console.log(this.passwordForm.value);
  }
}
