import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserInfo, UserService } from '../services/user.service';

@Component({
  selector: 'app-person',
  templateUrl: './person.page.html',
  styleUrls: ['./person.page.scss'],
})
export class PersonPage implements OnInit {

  private userSubscription: Subscription;
  private person: UserInfo;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const username: string = params.get('username');
      this.userSubscription = this.userService.getUserByUsername(username)
      .subscribe(users => { this.person = users[0]; });
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
