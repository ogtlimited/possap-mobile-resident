import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { MenuController, Platform, ToastController } from '@ionic/angular';

import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

import { Preferences as Storage } from '@capacitor/preferences';

import { UserData } from './providers/user-data';
import { AuthService } from './core/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  appPages = [
    {
      title: 'Home',
      url: '/app/tabs/home',
      icon: 'calendar',
    },
    {
      title: 'Request',
      url: '/app/tabs/requests',
      icon: 'people',
    },
    {
      title: 'About',
      url: '/app/tabs/about',
      icon: 'information-circle',
    },
  ];
  loggedIn = false;
  dark = false;
  user = null;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private userData: UserData,
    private authService: AuthService,
    private toastCtrl: ToastController
  ) {
    this.initializeApp();
  }

  async ngOnInit() {
    this.authService.currentUser$.subscribe((e) => {
      if(!e){
        this.user = null;
      }else{
        this.user = e;
      }
    });
    this.authService.currentUser().subscribe((e) => {
      console.log(JSON.parse(e.value));
      if (e.value) {
        this.user = JSON.parse(e.value);
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (this.platform.is('hybrid')) {
        // StatusBar.hide();
        SplashScreen.hide();
      }
    });
  }




  logout() {
    this.authService.logout().then((e) => {
      console.log('logged out');
    });
  }

  openTutorial() {
    this.menu.enable(false);
    Storage.set({ key: 'ion_did_tutorial', value: 'true' });
    this.router.navigateByUrl('/tutorial');
  }
}
