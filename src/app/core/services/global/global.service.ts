import { RequestService } from './../../request/request.service';
/* eslint-disable @typescript-eslint/naming-convention */
import {
  baseEndpoints,
  serverBaseUrl,
  utilityEndpoint,
} from './../../config/endpoints';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import Base64 from 'crypto-js/enc-base64';
import * as crypto from 'crypto-js';
import { BehaviorSubject, Observable, forkJoin, from } from 'rxjs';
import { Preferences as Storage } from '@capacitor/preferences';
import { ToastController } from '@ionic/angular';
import { Camera, PermissionStatus } from '@capacitor/camera';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  ABSOLUTE_URL_REGEX = /^(?:[a-z]+:)?\/\//;
  statesLgas$: BehaviorSubject<any> = new BehaviorSubject<[]>(null);

  constructor(private reqS: RequestService, private toast: ToastController) {}

  async presentToast(msg, position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toast.create({
      message: msg,
      duration: 1500,
      position,
      color:'primary'
    });

    await toast.present();
  }

  nearestPlaces(searchText) {
    const key = environment.mapsKey;
    // const url = GoogleMapUrl + searchText + '&inputtype=textquery&key=' + key;
    return this.reqS.get('');
  }

  getUrlString(path, queryParams = {}) {
    const baseURL = path.includes('http')
      ? path
      : this.pathJoin([serverBaseUrl, path], '/');
    const url = this.pathJoin([baseURL, this.getQueryString(queryParams)], '?');
    const absoluteUrl = this.toAbsolutePath(url);
    return absoluteUrl;
  }

  toAbsolutePath(baseUrl) {
    return this.ABSOLUTE_URL_REGEX.test(baseUrl)
      ? baseUrl
      : this.pathJoin([window.location.origin, baseUrl], '/');
  }

  getQueryString(params = {}) {
    return Object.entries(params)
      .filter(([, value]) => this.isValueNotEmpty(value))
      .map(([key, value]) => [
        encodeURIComponent(key),
        encodeURIComponent(this.processQueryStringValue(value)),
      ])
      .map((entry) => entry.join('='))
      .join('&');
  }

  isValueNotEmpty(value: unknown): unknown {
    if (Array.isArray(value)) {
      return value.length !== 0;
    }
    return value != null;
  }

  processQueryStringValue(value: any): string | number | boolean {
    if (Array.isArray(value)) {
      return value.join(',');
    }
    return value;
  }

  pathJoin(parts, separator = '/') {
    return parts
      .map((part, index) => {
        if (index > 0) {
          return part.replace(new RegExp(`^\\${separator}`), '');
        }

        if (index !== parts.length - 1) {
          return part.replace(new RegExp(`\\${separator}$`), '');
        }

        return part;
      })
      .filter((part) => part != null && part !== '')
      .join(separator);
  }

  computeHash(value) {
    const hmac = crypto.algo.HMAC.create(
      crypto.algo.SHA256,
      environment.clientSecret
    );
    hmac.update(value);
    return Base64.stringify(hmac.finalize());
  }

  getState() {
    return this.reqS.get(baseEndpoints.helper + '/all-states');
  }

  computeCBSBody(
    method,
    url,
    headers,
    hashField = '',
    hashmessage = '',
    body = null
  ) {
    return {
      requestObject: {
        body,
        headers: {
          ...headers,
        },
        helpers: {
          method,
          url,
          hashField,
          hashmessage,
          clientSecret: environment.clientSecret,
        },
      },
    };
  }

  fetchStorageObject(key): Observable<any> {
    return from(Storage.get({ key }));
  }
  setStorageObject(key, val): Observable<any> {
    return from(Storage.set({ key, value: JSON.stringify(val) }));
  }

  fetchAllFormData() {
    const response1 = this.reqS.get(baseEndpoints.extractFormdata);
    // const response2 = this.reqS.get(baseEndpoints.pccFormdata);
    const response3 = this.reqS.get(utilityEndpoint.countries);
    return forkJoin([response1, response3]);
  }
  startEnd() {
    const today = new Date();
    const startDate = new Date(new Date().setDate(today.getDate() - 90)).toLocaleDateString(
      'en-GB'
      );
    const endDate = new Date().toLocaleDateString('en-GB');
    return {
      startDate,
      endDate,
    };
  }

  async  getCameraPermission(): Promise<boolean> {
    console.log('GET PERMISSION');
    if (this.hasCameraPermission(await Camera.checkPermissions())) {
      return true;
    }

    const result = this.hasCameraPermission(await Camera.requestPermissions({ permissions: ['camera'] }));
    console.log('RESULT', result);
    return result;
  }

   hasCameraPermission({ camera }: PermissionStatus): boolean {
    switch (camera) {
      case 'granted':
        return true;
    }
    return false;
  }

}
