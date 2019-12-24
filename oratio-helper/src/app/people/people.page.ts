import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { first } from 'rxjs/operators';

import { UserInfo, UserService } from '../services/user.service';
import { LoginService } from '../services/login.service';
import { Subscription } from 'rxjs';
import { CloudFunctionsService } from '../services/cloud-functions.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.page.html',
  styleUrls: ['./people.page.scss'],
})
export class PeoplePage implements OnInit {

  private userInput: string;
  private isLoading: boolean = false;
  private afsSubscription: Subscription;
  private people: UserInfo[];
  private resultPeople: UserInfo[];

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private router: Router,
    private alertController: AlertController,
    private cloudFunctions: CloudFunctionsService
  ) { }

  ngOnInit() { this.updateState(); }
  ionViewWillEnter() { this.updateState(); }
  ngOnDestroy() { this.afsSubscription.unsubscribe(); }

  updateState() {
    this.isLoading = true;
    if (!this.loginService.isLoggedIn()) { this.router.navigateByUrl('/home'); }
    if (this.loginService.loggedUser.supervision.length === 0) {
      this.people = [];
      this.resultPeople = [];
      this.isLoading = false;
    } else {
      this.afsSubscription = this.userService.getPeople(this.loginService.loggedUser.supervision)
      .subscribe((people: UserInfo[]) => {
        this.isLoading = false;
        this.people = this.userService.sortUsersByName(people);
        this.resultPeople = [];
        for (let user of this.people) { this.resultPeople.push(user); }
      });
    }
  }

  onClickPerson(user: UserInfo) {
    if (this.isNewPerson(user)) { this.handleNewNotification(user); }
    else { this.router.navigateByUrl(`/person/${user.username}`); }
  }

  async handleNewNotification(user: UserInfo) {
    const alert = await this.alertController.create({
      header: 'Nouvelle personne',
      message: `${user.firstName} ${user.lastName} a récemment indiqué que vous êtes son aidant. Souhaitez-vous ajouter cette personne à votre liste ? (Répondre "Non" supprimera le compte de ${user.firstName})`,
      buttons: [
        {
          text: 'Non',
          cssClass: 'danger',
          handler: () => { this.removePerson(user); }
        }, {
          text: 'Oui',
          cssClass: 'primary',
          handler: () => { this.acceptPerson(user); }
        }
      ]
    });

    await alert.present();
  }

  removePerson(user: UserInfo) {
    this.router.navigateByUrl('/loading');
    const userGmail: string = user.gmail;
    const userUsername: string = user.username;
    this.cloudFunctions.removeUser(userGmail)
    .pipe(first()).subscribe((response) => {
      const updatedUser = {
        access_token: this.loginService.loggedUser.access_token,
        birth: this.loginService.loggedUser.birth,
        cellphone: this.loginService.loggedUser.cellphone,
        firstName: this.loginService.loggedUser.firstName,
        lastName: this.loginService.loggedUser.lastName,
        gmail: this.loginService.loggedUser.gmail,
        isHelper: this.loginService.loggedUser.isHelper,
        supervision: this.loginService.loggedUser.supervision,
        username: this.loginService.loggedUser.username
      };
      for (let notif of updatedUser.supervision) {
        if (notif.username === userUsername) {
          const index = updatedUser.supervision.indexOf(notif);
          if (index > -1) {
            updatedUser.supervision.splice(index, 1);
            break;
          }
        }
      }
      this.cloudFunctions.updateUser(updatedUser)
      .pipe(first()).subscribe((response) => {
        this.router.navigateByUrl('/people');
      });
    });
  }

  acceptPerson(user: UserInfo) {
    this.router.navigateByUrl('/loading');
    const updatedUser: UserInfo = {
      access_token: this.loginService.loggedUser.access_token,
      birth: this.loginService.loggedUser.birth,
      cellphone: this.loginService.loggedUser.cellphone,
      firstName: this.loginService.loggedUser.firstName,
      lastName: this.loginService.loggedUser.lastName,
      gmail: this.loginService.loggedUser.gmail,
      isHelper: this.loginService.loggedUser.isHelper,
      supervision: this.loginService.loggedUser.supervision,
      username: this.loginService.loggedUser.username
    };
    for (let notif of updatedUser.supervision) {
      if (notif.username === user.username) { notif.new = false; }
    }
    this.cloudFunctions.updateUser(updatedUser)
    .pipe(first()).subscribe((response) => {
      this.router.navigateByUrl('/people');
    });
  }

  isNewPerson(user: UserInfo) {
    for (let notif of this.loginService.loggedUser.supervision) {
      if (notif.username === user.username) { return notif.new; }
    }
    return false;
  }

  onSearch($event) {
    let input = ($event !== null) ? $event.target.value : this.userInput;
    if (input === null || input === undefined) { this.resultPeople = this.people; }
    else if (input.length === 0) { this.resultPeople = this.people; }
    else {
      let searchResult: UserInfo[] = [];
      for (let user of this.people) {
        if (this.isUserMatchingInput(user, input)) { searchResult.push(user) }
      }
      this.resultPeople = searchResult;
    }
  }

  isUserMatchingInput(user: UserInfo, input: string): boolean {
    let upperInput: string = input.toUpperCase();
    if (user.firstName.toUpperCase().startsWith(upperInput)) { return true; }
    if (user.lastName.toUpperCase().startsWith(upperInput)) { return true; }
    let fullName: string = user.firstName + ' ' + user.lastName;
    if (fullName.toUpperCase().startsWith(upperInput)) { return true; }
    return false;
  }

}
