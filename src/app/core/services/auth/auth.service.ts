/* eslint-disable @typescript-eslint/naming-convention */
import {
  authEndpoints,
  baseEndpoints,
  miscEndpoint,
  serviceEndpoint,
} from './../../config/endpoints';
import { RequestService } from './../../request/request.service';
import { Injectable } from '@angular/core';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import { Preferences as Storage } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { GlobalService } from '../global/global.service';
import { HttpHeaders } from '@angular/common/http';

const TOKEN_KEY = 'my-token';
const CURRENT_USER = 'current-user';
const VERIFY_TOKEN = 'verify-token';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  currentUser$: BehaviorSubject<any> = new BehaviorSubject<boolean>(null);
  tempUserData$: BehaviorSubject<any> = new BehaviorSubject<object>(null);
  token = '';
  headers = new HttpHeaders();

  constructor(
    private reqS: RequestService,
    private globalS: GlobalService,
    private router: Router
  ) {
    this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    this.headers.set('Access-Control-Allow-Origin', '*');
    this.loadToken();
    this.currentUser().subscribe((e) => {
      // console.log(e);
      if (e.value !== 'undefined') {
        this.currentUser$.next(JSON.parse(e.value));
      }
    });
  }

  async loadToken() {
    const token = await Storage.get({ key: CURRENT_USER });
    if (token && token.value) {
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }
  async getToken(key = TOKEN_KEY) {
    const token = await Storage.get({ key });
    return token && token.value ? token.value : null;
  }

  login(credentials: any): Observable<any> {
    const body = this.globalS.computeCBSBody(
      'post',
      authEndpoints.login,
      {},
      '',
      '',
      credentials
    );
    return this.reqS.postFormData(serviceEndpoint.fetchData, body).pipe(
      switchMap((res: any) => {
        // console.log(res);
        const obj = res.data;
        console.log(obj);
        if (!obj.Error) {
          this.currentUser$.next(obj.ResponseObject);
          from(
            Storage.set({
              key: CURRENT_USER,
              value: JSON.stringify(obj.ResponseObject),
            })
          );
          return of(res);
        } else {
          this.isAuthenticated.next(false);
          return of(res);
        }
      }),
      tap((res) => {
        console.log(res);
        if (res.data.Error) {
          this.isAuthenticated.next(false);
        } else {
          this.isAuthenticated.next(true);
        }
      })
    );
  }
  signup(credentials: {
    name: any;
    email: any;
    password: any;
  }): Observable<any> {
    return this.reqS.postFormData(authEndpoints.signup, credentials).pipe(
      switchMap((res: any) => {
        console.log(res);
        this.currentUser$.next(res.ResponseObject.UserObject);
        Storage.set({
          key: VERIFY_TOKEN,
          value: res.ResponseObject.Token,
        });
        return from(
          Storage.set({
            key: CURRENT_USER,
            value: JSON.stringify(res.ResponseObject.UserObject),
          })
        );
      }),
      tap((_) => {
        console.log('authenticated');
      })
    );
  }
  getNIN(nin: any): Observable<any> {
    const queryParams = {
      nin,
    };
    const url = this.globalS.getUrlString(baseEndpoints.nin, queryParams);
    return this.reqS.get(url);
  }
  activateAccount(credentials: {
    Token: string;
    Code: string;
  }): Observable<any> {
    return this.reqS.postEncoded(authEndpoints.activate, credentials);
  }
  forgotPasswordInitiate(credentials: { email: any }): Observable<any> {
    console.log(credentials);
    return this.reqS.postEncoded(authEndpoints.forgotPasswordInitiate, credentials);
  }
  forgotPasswordComplete(credentials: {
    email: any;
    verificationCode: any;
    password: any;
  }): Observable<any> {
    return this.reqS.postEncoded(authEndpoints.forgotPasswordComplete, credentials);
  }
  changePassword(
    id: string,
    credentials: { oldPassword: any; newPassword: any }
  ): Observable<any> {
    return this.reqS.put(authEndpoints.changePassword + '/' + id, credentials);
  }
  updateUser(
    id: string | number,
    credentials: { avater: any }
  ): Observable<any> {
    return this.reqS.put(baseEndpoints.user + '/' + id, credentials).pipe(
      switchMap((res: any) => {
        console.log(res);
        this.currentUser$.next(res.data);
        return from(
          Storage.set({ key: CURRENT_USER, value: JSON.stringify(res.data) })
        );
      })
    );
  }

  sendResetOtp(credentials: { Email: any }): Observable<any> {
    return this.reqS.postEncoded(authEndpoints.resetPasswordOtp, credentials);
  }

  validateResetOtp(credentials: {
    Token: any;
    Code: any;
  }): Observable<any> {
    return this.reqS.postEncoded(authEndpoints.activate, credentials);
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    return this.reqS.postEncoded(miscEndpoint.mediaUpload, formData);
  }
  currentUser(): Observable<any> {
    return from(Storage.get({ key: CURRENT_USER }));
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    this.currentUser$.next(null);
    Storage.remove({ key: CURRENT_USER });
    Storage.remove({ key: 'my_cart' });
    this.router.navigateByUrl('/login');
    return Storage.remove({ key: TOKEN_KEY });
  }
}
