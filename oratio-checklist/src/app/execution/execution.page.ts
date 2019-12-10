import { Component, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { Checklist, ChecklistService } from 'src/app/services/checklist.service';

@Component({
  selector: 'app-execution',
  templateUrl: './execution.page.html',
  styleUrls: ['./execution.page.scss'],
})
export class ExecutionPage implements OnInit {

  private user: string;
  private name: string;
  private userChecklists: Checklist[];
  private checklist: Checklist;
  private checklistsSubscription: Subscription;
 
  constructor(private route: ActivatedRoute, private checklistService: ChecklistService) {}
 
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.user = params.get('user');
      this.name = params.get('name');
    });
    this.checklistsSubscription = this.checklistService.getChecklistsByUser(this.user)
    .subscribe(checklists => {
      this.userChecklists = checklists
      for (let checklist of this.userChecklists) {
        if (checklist.name == this.name) {
          this.checklist = ChecklistService.sortChecklist(checklist);
          break;
        }
      }
    });
  }

  ngOnDestroy() {
    this.checklistsSubscription.unsubscribe();
  }

  // ionViewWillEnter() {
  //   this.checklistsSubscription = this.checklistService.getChecklistsByUser(this.USER)
  //   .subscribe(checklists => {
  //     this.userChecklists = checklists
  //     for (let checklist of this.userChecklists) {
  //       if (checklist.name == this.NAME) {
  //         this.checklist = ChecklistService.sortChecklist(checklist);
  //         break;
  //       }
  //     }
  //   });
  // }

  // ionViewWillLeave() {
  //   this.checklistsSubscription.unsubscribe();
  //   this.checklist = null;
  //   this.userChecklists = null;
  // }

  onClickCheckBox(id: number, checked: boolean) {
    console.log(id + ': done=' + this.checklist.items[id].done);
  }

}
