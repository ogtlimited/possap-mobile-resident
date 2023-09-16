/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/naming-convention */
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Preferences as Storage } from '@capacitor/preferences';

export function CheckTutorial(): CanActivateFn {
  return async () => {
    const router = inject(Router);

    const res = await Storage.get({ key: 'ion_did_tutorial' });
    console.log(res);
    if (res) {
      return true;
    } else {
      router.navigate(['/app', 'tabs', 'home']);
    }
  };
}
