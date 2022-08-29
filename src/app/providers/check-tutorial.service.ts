import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { Preferences as Storage } from '@capacitor/preferences';
@Injectable({
  providedIn: 'root'
})
export class CheckTutorial implements CanLoad {
  constructor(private router: Router) {}

  canLoad() {
    return Storage.get({key: 'ion_did_tutorial'}).then(res => {
      if (res) {
        this.router.navigate(['/app', 'tabs', 'home']);
        return false;
      } else {
        return true;
      }
    });
  }
}
