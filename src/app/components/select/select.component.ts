import { ModalController, LoadingController } from '@ionic/angular';
import { RequestService } from './../../core/request/request.service';
import { Component, Input, OnInit } from '@angular/core';
import { baseEndpoints } from 'src/app/core/config/endpoints';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  @Input() control;
  @Input() myForm;
  @Input() jsonFormData;
  list: any = [];
  selected = null;
  constructor(
    private reqS: RequestService,
    private modal: ModalController,
    private loader: LoadingController
  ) {}

  ngOnInit() {
    console.log(this.control, this.jsonFormData);
    const obj = {};
    this.fetchData();
  }

  async fetchData() {
    const loading = await this.loader.create();
    await loading.present();
    try {
      const field = this.jsonFormData?.controls.filter(
        (e) => e.name === this.control.name
      )[0];
      console.log(this.control.name, field);

      const res: any = await this.reqS
        .post(baseEndpoints.helper + '/' + field?.api?.path, {
          [field?.api?.body?.key]:
            this.myForm?.value[field?.api?.body?.value] || '',
        })
        .toPromise();
      loading.dismiss();
      console.log(field.name);
      console.log(this.control);
      this.list = res.data;
      // this.list = res.data.map((s) => ({ key: s, value: s }));
      this.loader.dismiss();
      // this.jsonFormData.controls = newControl;
      console.log(res.data, this.list);
      // return data;
    } catch (error) {
      this.loader.dismiss();
      console.log(error);
      return [];
    }
  }
  selectItem(val) {
    this.selected = val;
  }
  save() {
    this.modal.dismiss(this.selected);
  }
}
