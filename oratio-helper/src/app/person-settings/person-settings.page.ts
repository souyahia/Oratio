import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserInfo, UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-person-settings',
  templateUrl: './person-settings.page.html',
  styleUrls: ['./person-settings.page.scss'],
})
export class PersonSettingsPage implements OnInit {

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
