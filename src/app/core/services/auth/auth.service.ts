import {
  authEndpoints,
  baseEndpoints,
  miscEndpoint,
} from './../../config/endpoints';
import { RequestService } from './../../request/request.service';
import { Injectable } from '@angular/core';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { Preferences as Storage } from '@capacitor/preferences';
import { Router } from '@angular/router';
import { GlobalService } from '../global/global.service';

const TOKEN_KEY = 'my-token';
const CURRENT_USER = 'current-user';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    null
  );
  currentUser$: BehaviorSubject<any> = new BehaviorSubject<boolean>(null);
  token = '';

  constructor(private reqS: RequestService, private globalS: GlobalService, private router: Router) {
    this.loadToken();
    this.currentUser().subscribe((e) => {
      console.log(e);
      this.currentUser$.next(JSON.parse(e.value));
    });
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }
  async getToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    return token && token.value ? token.value : null;
  }

  login(credentials: { email; password }): Observable<any> {
    return this.reqS.post(authEndpoints.login, credentials).pipe(
      switchMap((res: any) => {
        console.log(res.token);
        this.currentUser$.next(res.data);
        from(
          Storage.set({ key: CURRENT_USER, value: JSON.stringify(res.data) })
        );
        return from(Storage.set({ key: TOKEN_KEY, value: res.token.token }));
      }),
      tap((_) => {
        this.isAuthenticated.next(true);
      })
    );
  }
  signup(credentials: { name; email; password }): Observable<any> {
    return this.reqS.post(authEndpoints.signup, credentials).pipe(
      switchMap((res: any) => {
        this.currentUser$.next(res.data);
        return from(
          Storage.set({ key: CURRENT_USER, value: JSON.stringify(res.data) })
        );
      }),
      tap((_) => {
        console.log('authenticated');
      })
    );
  }
  getNIN(nin): Observable<any> {
    const queryParams = {
      nin,
    };
    const url = this.globalS.getUrlString(baseEndpoints.nin, queryParams);
    return this.reqS.get(url);
  }
  activateAccount(credentials: { phone; code }, id): Observable<any> {
    return this.reqS.put(authEndpoints.activate + id, credentials).pipe(
      switchMap((data: any) => {
        from(
          Storage.set({ key: CURRENT_USER, value: JSON.stringify(data.user) })
        );
        return from(Storage.set({ key: TOKEN_KEY, value: data.token }));
      }),
      tap((_) => {
        this.isAuthenticated.next(true);
      })
    );
  }
  forgotPasswordInitiate(credentials: { email }): Observable<any> {
    return this.reqS.post(authEndpoints.forgotPasswordInitiate, credentials);
  }
  forgotPasswordComplete(credentials: {
    email;
    verificationCode;
    password;
  }): Observable<any> {
    return this.reqS.post(authEndpoints.forgotPasswordComplete, credentials);
  }
  changePassword(credentials: { oldPassword; newPassword }): Observable<any> {
    return this.reqS.post(authEndpoints.changePassword, credentials);
  }
  updateUser(id, credentials): Observable<any> {
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

  uploadProfileImage(formData): Observable<any> {
    return this.reqS.post(miscEndpoint.mediaUpload, formData);
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
