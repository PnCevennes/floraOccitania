import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from 'ng2-cookies';


import {AppSettings} from '../appSettings';


export interface User {
  identifiant: string;
  id_role: string;
  id_organisme: number;
  prenom_role?: string;
  nom_role?: string;
  nom_complet?: string;
}


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    token: string;

    constructor(private http: HttpClient, private _cookie: CookieService) {
        this.currentUserSubject = new BehaviorSubject<User>(this.getCurrentUser());
        this.currentUser = this.currentUserSubject.asObservable();
    }


    public setCurrentUser(user) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }

    getCurrentUser() {
      let currentUser = sessionStorage.getItem('currentUser');

      if (!currentUser) {
        const userCookie = this._cookie.get('currentUser');
        if (userCookie !== '') {
          let decodedCookie = this.decodeObjectCookies(userCookie);
          decodedCookie = decodedCookie.split("'").join('"');
          this.setCurrentUser(decodedCookie);
          currentUser = sessionStorage.getItem('currentUser');
        }
      }

      return JSON.parse(currentUser);
    }

  setToken(token, expireDate) {
    this._cookie.set('token', token, expireDate);
  }

  getToken() {
    const token = this._cookie.get('token');
    const response = token.length === 0 ? null : token;
    return response;
  }


  login(username: string, pwd: string) {

    const options = {
      login: username,
      password: pwd,
      id_application: AppSettings.ID_APPLICATION
    };
    return this.http.post<any>(`${AppSettings.API_ENDPOINT}auth/login`, options)
        .pipe(map(data => {
            // login successful if there's a jwt token in the response
            if (data) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                const userForFront = {
                  identifiant: data.user.identifiant,
                  prenom_role: data.user.prenom_role,
                  id_role: data.user.id_role,
                  nom_role: data.user.nom_role,
                  nom_complet: data.user.nom_role + ' ' + data.user.prenom_role,
                  id_organisme: data.user.id_organisme
                };
                sessionStorage.setItem('currentUser', JSON.stringify(data.user));
                this.currentUserSubject.next(userForFront);
                this.currentUser = this.currentUserSubject.asObservable();
            }

            return data;
        }));
  }

  decodeObjectCookies(val) {
    if (val.indexOf('\\') === -1) {
      return val; // not encoded
    }
    val = val.slice(1, -1).replace(/\\"/g, '"');
    val = val.replace(/\\(\d{3})/g, function(match, octal) {
      return String.fromCharCode(parseInt(octal, 8));
    });
    return val.replace(/\\\\/g, '\\');
  }

  deleteAllCookies() {
    document.cookie.split(';').forEach(c => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  }


  isAuthenticated(): boolean {
    return this._cookie.get('token') !== null;
  }

  logout() {
      this.deleteAllCookies();
      // remove user from local storage to log user out
      sessionStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
  }
}