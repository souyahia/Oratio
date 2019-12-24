import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonSettingsPage } from './person-settings.page';

const routes: Routes = [
  {
    path: '',
    component: PersonSettingsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonSettingsPageRoutingModule {}
