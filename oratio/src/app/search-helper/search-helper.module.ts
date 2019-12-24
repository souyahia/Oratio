import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SearchHelperPageRoutingModule } from './search-helper-routing.module';

import { SearchHelperPage } from './search-helper.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SearchHelperPageRoutingModule
  ],
  declarations: [SearchHelperPage]
})
export class SearchHelperPageModule {}
