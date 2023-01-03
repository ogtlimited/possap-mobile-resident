/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-cmr-form',
  templateUrl: './cmr-form.component.html',
  styleUrls: ['./cmr-form.component.scss'],
})
export class CmrFormComponent implements OnInit {
  title = 'Central Motor Registry';
  cmrForm: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.cmrForm = this.fb.group({
      plateNumber: ['', Validators.required],
      vin: ['', [Validators.required, Validators.email]],
      vehColor: ['', [Validators.required, Validators.minLength(15)]],
      ownershipProof: ['', [Validators.required, Validators.minLength(15)]],
      roadWorthiness: ['', [Validators.required, Validators.minLength(15)]],
      pickupLocation: ['', [Validators.required, Validators.minLength(15)]],
      reason: ['', [Validators.required, Validators.minLength(15)]],
    });
  }

  onSubmit() {
    console.log(this.cmrForm.value);
  }

  get roadWorthiness() {
    return this.cmrForm.get('roadWorthiness');
  }
  get pickupLocation() {
    return this.cmrForm.get('pickupLocation');
  }
  get ownershipProof() {
    return this.cmrForm.get('ownershipProof');
  }
  get vin() {
    return this.cmrForm.get('vin');
  }
  get vehColor() {
    return this.cmrForm.get('vehColor');
  }
  get plateNumber() {
    return this.cmrForm.get('plateNumber');
  }
}
