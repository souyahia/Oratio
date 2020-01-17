import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExecutePage } from './execute.page';

const routes: Routes = [
  {
    path: '',
    component: ExecutePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecutePageRoutingModule {}
