import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PersonSettingsPageRoutingModule } from './person-settings-routing.module';

import { PersonSettingsPage } from './person-settings.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PersonSettingsPageRoutingModule
  ],
  declarations: [PersonSettingsPage]
})
export class PersonSettingsPageModule {}
