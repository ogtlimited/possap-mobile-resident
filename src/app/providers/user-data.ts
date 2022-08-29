import { Injectable } from '@angular/core';
import { Preferences as Storage } from '@capacitor/preferences';


@Injectable({
  providedIn: 'root'
})
export class UserData {
  favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
  ) { }

  hasFavorite(sessionName: string): boolean {
    return (this.favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName: string): void {
    this.favorites.push(sessionName);
  }

  removeFavorite(sessionName: string): void {
    const index = this.favorites.indexOf(sessionName);
    if (index > -1) {
      this.favorites.splice(index, 1);
    }
  }

  login(username: string): Promise<any> {
    return Storage.set({key: this.HAS_LOGGED_IN, value: 'true'}).then(() => {
      this.setUsername(username);
      return window.dispatchEvent(new CustomEvent('user:login'));
    });
  }

  signup(username: string): Promise<any> {
    return Storage.set({key: this.HAS_LOGGED_IN, value: 'true'}).then(() => {
      this.setUsername(username);
      return window.dispatchEvent(new CustomEvent('user:signup'));
    });
  }

  logout(): Promise<any> {
    return Storage.remove({key: this.HAS_LOGGED_IN}).then(() => {
      return Storage.remove({key:'username'});
    }).then(() => {
      window.dispatchEvent(new CustomEvent('user:logout'));
    });
  }

  setUsername(username: string): Promise<any> {
    return Storage.set({key: 'username', value: username});
  }

  getUsername(): Promise<string> {
    return Storage.get({key: 'username'}).then((value) => {
      return value.value;
    });
  }

  isLoggedIn(): Promise<boolean> {
    return Storage.get({key: this.HAS_LOGGED_IN}).then((value) => {
      return value.value === 'true';
    });
  }

  checkHasSeenTutorial(): Promise<string> {
    return Storage.get({key: this.HAS_SEEN_TUTORIAL}).then((value) => {
      return value.value;
    });
  }
}
