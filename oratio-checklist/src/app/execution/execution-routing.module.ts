import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExecutionPage } from './execution.page';

const routes: Routes = [
  {
    path: '',
    component: ExecutionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecutionPageRoutingModule {}
