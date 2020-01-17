import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-execute',
  templateUrl: './execute.page.html',
  styleUrls: ['./execute.page.scss'],
})
export class ExecutePage implements OnInit {

  private _userParam: string;
  private _nameParam: string;
  private _paramSubscription: Subscription;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this._paramSubscription = this.route.paramMap
    .subscribe((params: Params) => {
      this.userParam = params.get('user');
      this.nameParam = params.get('name');
    });
  }

  ngOnDestroy() { this._paramSubscription.unsubscribe(); }

  public get userParam(): string { return this.userParam; }
  public get nameParam(): string { return this.nameParam; }

  public set userParam(value: string) { this.userParam = value; }
  public set nameParam(value: string) { this.nameParam = value; }

}
