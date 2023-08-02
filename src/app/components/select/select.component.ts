import { ModalController, LoadingController } from '@ionic/angular';
import { RequestService } from './../../core/request/request.service';
import { Component, Input, OnInit } from '@angular/core';
import { baseEndpoints } from 'src/app/core/config/endpoints';
import { Preferences, Preferences as Storage } from '@capacitor/preferences';
@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  @Input() control;
  @Input() serviceId;
  @Input() myForm;
  @Input() jsonFormData;
  list: any = [];
  selected = null;
  themeMode: string;
  constructor(
    private reqS: RequestService,
    private modal: ModalController,
    private loader: LoadingController
  ) {}

  ngOnInit() {
    const obj = {};
    this.fetchData();
  }
  ionViewWillEnter() {
    this.fetchData();
  }

  async fetchData() {
    const theme = await Preferences.get({ key: 'themeMode' });
    this.themeMode = theme.value;
    console.log(this.themeMode);
    const loading = await this.loader.create();
    await loading.present();
    try {
      const field = this.jsonFormData?.controls.filter(
        (e) => e.name === this.control.name
      )[0];

      const res: any = await this.reqS
        .post(baseEndpoints.helper + '/' + field?.api?.path, {
          [field?.api?.body?.key]:
            this.myForm?.value[field?.api?.body?.value] || '',
          serviceId: this.serviceId,
        })
        .toPromise();
      loading.dismiss();
      this.list = res.data;
      // this.list = res.data.map((s) => ({ key: s, value: s }));
      this.loader.dismiss();
      // this.jsonFormData.controls = newControl;
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
