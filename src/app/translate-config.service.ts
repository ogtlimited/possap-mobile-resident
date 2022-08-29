import { LocalStorageService } from './core/services/storage/LocalStorage.service';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TranslateConfigService {
  textDir = 'ltr';
  constructor(
    private translate: TranslateService,
    private localS: LocalStorageService
  ) {
    const language =
      this.localS.get('applanguage') || this.translate.getBrowserLang();
    this.setLanguage(language);
  }

  getDefaultLanguage() {
    const language =
      this.localS.get('applanguage') || this.translate.getBrowserLang();
    this.translate.setDefaultLang(language);
    return language;
  }

  setLanguage(lang) {
    this.localS.set('applanguage', lang);
    this.translate.use(lang);
  }

}
