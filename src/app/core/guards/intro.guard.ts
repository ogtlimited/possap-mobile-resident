/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, inject } from '@angular/core';
import { CanActivateFn,   Router } from '@angular/router';
import { Preferences } from '@capacitor/preferences';


export const INTRO_KEY = 'ion_did_tutorial';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function IntroGuard(): CanActivateFn {
  return async () => {
    const router = inject(Router);

    const hasSeenIntro = await Preferences.get({key: INTRO_KEY});
    console.log(hasSeenIntro, 'INTRO GUARD');
    if (hasSeenIntro && (hasSeenIntro.value === 'true')) {
      router.navigate(['/app', 'tabs', 'home']);
    } else {
      return true;
    }
  };
}
