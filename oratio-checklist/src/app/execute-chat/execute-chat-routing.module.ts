import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExecuteChatPage } from './execute-chat.page';

const routes: Routes = [
  {
    path: '',
    component: ExecuteChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecuteChatPageRoutingModule {}
