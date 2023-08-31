import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { MenuController } from '@ionic/angular';

import { Preferences as Storage } from '@capacitor/preferences';
import Swiper from 'swiper';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial.html',
  styleUrls: ['./tutorial.scss'],
})
export class TutorialPage {
  showSkip = true;
  showTutorial = false;
  private slides: Swiper;

  constructor(
    public menu: MenuController,
    public router: Router,
    private cd: ChangeDetectorRef
  ) {
    Storage.get({key: 'ion_did_tutorial'}).then(res => {
      console.log(res);
      if (res.value === 'true') {
        this.router.navigateByUrl('/app/tabs/home', { replaceUrl: true });
      }else{
        this.showTutorial = true;
      }
    });

  }

  startApp() {
    console.log('tutoriaLS');
    this.router
      .navigateByUrl('/app/tabs/home', { replaceUrl: true })
      .then(() => Storage.set({key:'ion_did_tutorial', value: 'true'}));
  }

  setSwiperInstance(swiper: Swiper) {
    this.slides = swiper;
  }

  onSlideChangeStart() {
    this.showSkip = !this.slides.isEnd;
    this.cd.detectChanges();
  }

  ionViewDidEnter() {

    this.menu.enable(false);
  }

  ionViewDidLeave() {
    // enable the root left menu when leaving the tutorial page
    this.menu.enable(true);
  }
}
