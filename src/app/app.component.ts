import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

import { MenuController, Platform, ToastController } from '@ionic/angular';

import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

import { Preferences as Storage } from '@capacitor/preferences';

import { UserData } from './providers/user-data';
import { AuthService } from './core/services/auth/auth.service';
import { AppRate } from '@awesome-cordova-plugins/app-rate/ngx';
import { GlobalService } from './core/services/global/global.service';
import { PossapServicesService } from './core/services/possap-services/possap-services.service';
import { AxiosResponse, ServiceResponse } from './core/models/ResponseModel';

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
    private globalS: GlobalService,
    private appRate: AppRate,
    private possapS: PossapServicesService,
  ) {
    // Add or remove the "dark" class based on if the media query matches
    this.initializeApp();
    this.getStateLGA();
  }

  toggleDarkTheme(shouldAdd) {
    const mode = shouldAdd ? 'light' : 'dark';
    Storage.set({ key: 'themeMode', value: mode });
    document.body.classList.toggle('dark', !shouldAdd);
  }
  getStateLGA() {
    this.globalS.getState().subscribe((states) => {
      console.log(states);
      this.globalS.statesLgas$.next(states.data);
      Storage.set({ key: 'states', value: JSON.stringify(states.data) });
    });
  }

  async ngOnInit() {
    this.possapS.fetchCBSServices().subscribe((s: AxiosResponse) => {
      console.log(s.data);
      Storage.set({key: 'CBS-CORE', value : JSON.stringify(s.data.ResponseObject) });
    });
    this.authService.currentUser$.subscribe((e) => {
      console.log(e);
      if (!e) {
        this.user = null;
      } else {
        this.user = e;
      }
    });
    this.authService.currentUser().subscribe((e) => {
      // console.log(JSON.parse(e.value));
      if (e.value !== 'undefined') {
        console.log(e);
        this.user = JSON.parse(e.value);
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      console.log(this.platform.is('hybrid'));
      if (this.platform.is('hybrid')) {
        // StatusBar.hide();
        SplashScreen.hide();
      }
      const themeMode = await Storage.get({ key: 'themeMode' });
      if (themeMode.value) {
        this.dark = themeMode.value === 'light' ? false : true;
        document.body.classList.toggle('dark', this.dark);
      } else {
        Storage.set({ key: 'themeMode', value: 'light' });
      }
    });
    // this.loadData();
  }

  logout() {
    this.authService.logout().then((e) => {
      console.log('logged out');
    });
  }

  rate() {
    // set certain preferences
    this.appRate.setPreferences({
      storeAppURL: {
        ios: '<app_id>',
        android: 'market://details?id=<package_name>',
        windows: 'ms-windows-store://review/?ProductId=<store_id>',
      },
    });

    this.appRate.promptForRating(true);
  }

  // openTutorial() {
  //   this.menu.enable(false);
  //   Storage.set({ key: 'ion_did_tutorial', value: 'true' });
  //   this.router.navigateByUrl('/tutorial');
  // }

  loadData() {
    this.globalS.fetchAllFormData().subscribe((res) => {
      console.log(res);
    });
  }
}
