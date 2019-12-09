import { Component, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { Checklist, ChecklistService } from 'src/app/services/checklist.service';

@Component({
  selector: 'app-execution',
  templateUrl: './execution.page.html',
  styleUrls: ['./execution.page.scss'],
})
export class ExecutionPage implements OnInit {

  public USER = 'anova';
  public NAME = 'work';

  private userChecklists: Checklist[];
  private checklist: Checklist;
  private checklistsSubscription: Subscription;
 
  constructor(private checklistService: ChecklistService) {
  }
 
  ngOnInit() {
    this.checklistsSubscription = this.checklistService.getChecklistsByUser(this.USER)
    .subscribe(checklists => {
      this.userChecklists = checklists
      for (let checklist of this.userChecklists) {
        if (checklist.name == this.NAME) {
          this.checklist = checklist;
          break;
        }
      }
    });
  }

  ngOnDestroy() {
    this.checklistsSubscription.unsubscribe();
  }

}
