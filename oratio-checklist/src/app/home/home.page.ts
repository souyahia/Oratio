import { Component } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private _usernameInput: string = '';
  private _checklistInput: string = '';

  constructor(
    private router: Router
  ) {}

  public onClickExecute(): void {
    this.router.navigateByUrl(`/execute/${this.usernameInput}/${this.checklistInput}`);
  }

  public onClickEdit(): void {
    this.router.navigateByUrl(`/edit/${this.usernameInput}/${this.checklistInput}`);
  }

  public get isFormValid(): boolean {
    return (this.usernameInput.length > 0 && this.checklistInput.length > 0);
  }

  public get usernameInput(): string { return this._usernameInput; }
  public get checklistInput(): string { return this._checklistInput; }

  public set usernameInput(value: string) { this._usernameInput = value; }
  public set checklistInput(value: string) { this._checklistInput = value; }

}
