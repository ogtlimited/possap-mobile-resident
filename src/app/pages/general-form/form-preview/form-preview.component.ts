import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-preview',
  templateUrl: './form-preview.component.html',
  styleUrls: ['./form-preview.component.scss'],
})
export class FormPreviewComponent implements OnInit {
  @Input() data;
  @Input() jsonFormData;
  keys = [];
  values = [];

  constructor() {}

  checkImage(value) {
    return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(value);
  }

  ngOnInit() {
    console.log(this.jsonFormData);
    if (this.data) {
      this.keys = Object.keys(this.data).map((v) =>
        v.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      );
      this.values = Object.values(this.data);
      console.log(this.values, 'test');
    }
  }
}
