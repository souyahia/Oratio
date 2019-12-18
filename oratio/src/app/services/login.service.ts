import { Injectable } from '@angular/core';

import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

import { Observable, Subscription } from 'rxjs';

import { googleId } from '../../../../apikeys/googleId';
import { UserInfo, UserService } from './user.service';

declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loggedUser: UserInfo;
  public userHelper: UserInfo;
  private userSubscription: Subscription;
  private helperSubscription: Subscription;

  constructor(private http: HttpClient,
    private platform: Platform,
    private userService: UserService
  ) {
    this.loggedUser = null;
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
    this.helperSubscription.unsubscribe();
  }

  public isLoggedIn(): boolean {
    return (this.loggedUser != null);
  }

  public logOut(): void {
    this.loggedUser = null;
  }

  public login() {
    this.platform.ready()
      .then(this.googleLogin)
      .then(success => {
        this.http.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${success.access_token}`)
        .subscribe((data: any) => {
          let userData = {
            gmail: data.email,
            firstName: data.given_name,
            lastName: data.family_name,
            access_token: success.access_token
          };
          this.userService.queryByGmail(userData.gmail)
          .subscribe((users: UserInfo[]) => {
            if (users.length === 0) {}
            else {
              this.loggedUser
            }
          });



          let firstName = data.given_name;
          let lastName = data.family_name;
          let access_token = success.access_token;
          this.cloudFunc.onUserLogin(gmail, firstName, lastName, access_token)
          .subscribe((userInfo: UserInfo) => {
            this.loggedUser = userInfo;
          })
        }
        , error => {
          console.error(error.status);
          console.error(error.error); 
          console.error(error.headers);
        });
      }, (error) => {
        console.error(error);
      });
  };
 
  public googleLogin(): Promise<any> {
    return new Promise(function (resolve, reject) {
      const url = `https://accounts.google.com/o/oauth2/auth?client_id=${googleId}` +
        "&redirect_uri=	http://localhost:8100" +
        "&scope=https://www.googleapis.com/auth/contacts.readonly https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/fitness.activity.write  https://www.googleapis.com/auth/fitness.activity.read" +
        "&response_type=token id_token";
      const browserRef = window.cordova.InAppBrowser.open(
        url,
        "_blank",
        "location=no, clearsessioncache=yes, clearcache=yes"
      );
      let responseParams: string;
      let parsedResponse: Object = {};
      browserRef.addEventListener("loadstart", (evt) => {
        if ((evt.url).indexOf("http://localhost:8100") === 0) {
          browserRef.removeEventListener("exit", (evt) => { });
          browserRef.close();
          responseParams = ((evt.url).split("#")[1]).split("&");
          for (var i = 0; i < responseParams.length; i++) {
            parsedResponse[responseParams[i].split("=")[0]] = responseParams[i].split("=")[1];
          }
          if (parsedResponse["access_token"] !== undefined &&
            parsedResponse["access_token"] !== null) {
            resolve(parsedResponse);
          } else {
            reject("Problème d’authentification avec Google");
          }
        }
      });
      browserRef.addEventListener("exit", function (evt) {
        reject("Une erreur est survenue lors de la tentative de connexion à Google");
      });
    });
  } 
}