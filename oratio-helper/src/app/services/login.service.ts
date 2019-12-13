import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { CloudFunctionsService } from './cloud-functions.service';
import { UserInfo, UserService } from './user.service';
import { googleId } from '../../../../apikeys/googleId';

export interface NewUserInfo {
  gmail: string,
  username: string,
  firstName: string,
  lastName: string,
  access_token: string
}

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loggedUser: UserInfo;
  public newUser: NewUserInfo;

  constructor(
    private http: HttpClient,
    private platform: Platform,
    private cloudFunctions: CloudFunctionsService,
    private userService: UserService,
    private router: Router
  ) {
    this.loggedUser = null;
    this.newUser = null;
  }

  public isNewUser() { return this.newUser != null; }

  public isLoggedIn() { return this.loggedUser != null; }

  public logout(): void {
    this.router.navigateByUrl('/home');
    this.loggedUser = null;
    this.newUser = null;
  }

  public logNewUser(userInfo: UserInfo) {
    this.router.navigateByUrl('/loading');
    this.cloudFunctions.addUser(userInfo)
    .subscribe((response) => {
      this.loginAs(response.document.gmail);
    });
  }

  private loginAs(gmail: string) {
    this.userService.getUserByGmail(gmail)
    .subscribe((users) => {
      if (users.length === 0) { this.logout(); }
      else {
        this.newUser = null;
        this.loggedUser = users[0];
        this.router.navigateByUrl('/home');
      }
    });
  }

  public login(): void {
    this.platform.ready()
    .then(this.googleLogin)
    .then(success => {
      this.http.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${success.access_token}`)
      .subscribe((data: any) => {
        this.router.navigateByUrl('/loading');
        const gmail = data.email;
        this.cloudFunctions.checkHelper(gmail)
        .subscribe((response) => {
          console.log(response);
          if (response.error !== undefined) {
            console.error(response.error);
            return { error: response.error };
          } else if (response.exists) {
            this.loginAs(gmail);
          } else {
            this.newUser = {
              gmail: gmail,
              username: this.generateUsername(gmail),
              firstName: data.given_name,
              lastName: data.family_name,
              access_token: success.access_token
            };
            this.router.navigateByUrl('/sign-in');
          }
        });
      }
      , error => {
        console.error(error.status);
        console.error(error.error); 
        console.error(error.headers);
      });
    }, (error) => {
      console.error(error);
    });
  }

  private googleLogin(): Promise<any> {
    return new Promise(function (resolve, reject) {
      const url = `https://accounts.google.com/o/oauth2/auth?client_id=${googleId}` +
        '&redirect_uri=	http://localhost:8100' +
        '&scope=https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email' +
        '&response_type=token id_token';
      const browserRef = window.cordova.InAppBrowser.open(
        url,
        '_blank',
        'location=no, clearsessioncache=yes, clearcache=yes'
      );
      let responseParams: string;
      let parsedResponse: Object = {};
      browserRef.addEventListener('loadstart', (evt) => {
        if ((evt.url).indexOf('http://localhost:8100') === 0) {
          browserRef.removeEventListener('exit', (evt) => { });
          browserRef.close();
          responseParams = ((evt.url).split('#')[1]).split('&');
          for (var i = 0; i < responseParams.length; i++) {
            parsedResponse[responseParams[i].split('=')[0]] = responseParams[i].split('=')[1];
          }
          if (parsedResponse['access_token'] !== undefined &&
            parsedResponse['access_token'] !== null) {
            resolve(parsedResponse);
          } else {
            reject('Problème d’authentification avec Google');
          }
        }
      });
      browserRef.addEventListener('exit', function (evt) {
        reject('Une erreur est survenue lors de la tentative de connexion à Google');
      });
    });
  } 

  private generateUsername(gmail: string): string {
    const reg = new RegExp('(.+)@([^.]+).(.+)', 'i');
    const result = gmail.match(reg);
    return (result === null) ? 'unknown' : result[1] + '_' + result[2] + '_' + result[3];
  }

}