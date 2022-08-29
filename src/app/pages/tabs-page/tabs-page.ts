import { PossapEyeComponent } from './possap-eye/possap-eye.component';
import { ModalController } from '@ionic/angular';
import { Component } from '@angular/core';

@Component({
  templateUrl: 'tabs-page.html',
  styleUrls: ['./tabs-page.scss']
})
export class TabsPage {

  constructor(private modal: ModalController ){

  }

  ionViewDidEnter() {
    // document.querySelector('#tab-button-tab3').shadowRoot.querySelector('.button-native').setAttribute('style', 'margin-top: -2px');
  }

  async presentModal(){
    const modal = await this.modal.create({
      component: PossapEyeComponent,

    })

    modal.present()
  }
}
