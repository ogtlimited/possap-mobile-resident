import { isEmpty } from 'lodash';
/* eslint-disable no-underscore-dangle */
import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';
import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() title;
  @Input() search;
  @Input() cart;
  @Input() dismiss = false;
  @Input() showProfile = false;
  @Input() showBack = false;
  @Input() isHome = false;
  @Input() showSos = false;
  cartTotal;
  constructor(
    private _location: Location,
    private modalController: ModalController,
    private router: Router
  ) {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit() {}

  back() {
    if (this.dismiss) {
      this.modalController.dismiss();
    } else {
      this._location.back();
    }
  }
  goToCart() {
    this.router.navigate(['menu/home/cart-orders']);
  }

  goto() {
    this.router.navigate(['sos']);
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: '',
      cssClass: 'fullscreen',
    });
    await modal.present();
  }
}
