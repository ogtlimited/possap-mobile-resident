import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-officer-form',
  templateUrl: './officer-form.component.html',
  styleUrls: ['./officer-form.component.scss'],
})
export class OfficerFormComponent implements OnInit {
  officerForm: FormGroup;
  hide = false;
  showForgotPasswordPage = false;
  showForgotPasswordPageComplete = false;
  constructor(private fb: FormBuilder,) { }

  ngOnInit() {
    this.officerForm = this.fb.group({
      apNumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  get apNumber() {
    return this.officerForm.get('apNumber');
  }

  get password() {
    return this.officerForm.get('password');
  }
  login(){

  }

}
