import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public username: string;
  public checklist: string;

  constructor(private router: Router) { }

  ngOnInit() {
    this.username = 'anova';
    this.checklist = 'work';
  }

  onClick() {
    this.router.navigateByUrl(`/execution/${this.username}/${this.checklist}`);
  }

}
