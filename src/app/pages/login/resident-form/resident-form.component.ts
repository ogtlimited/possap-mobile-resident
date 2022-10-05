/* eslint-disable @typescript-eslint/member-ordering */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-resident-form',
  templateUrl: './resident-form.component.html',
  styleUrls: ['./resident-form.component.scss'],
})
export class ResidentFormComponent implements OnInit {
  residentForm: FormGroup;
  hide = false;
  showForgotPasswordPage = false;
  showForgotPasswordPageComplete = false;
  @Output() emitForm: EventEmitter<any> = new EventEmitter();
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.residentForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get email() {
    return this.residentForm.get('email');
  }

  get password() {
    return this.residentForm.get('password');
  }

  login() {
    this.emitForm.next(this.residentForm.value);
  }
}
