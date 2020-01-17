import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExecutePageRoutingModule } from './execute-routing.module';

import { ExecutePage } from './execute.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExecutePageRoutingModule
  ],
  declarations: [ExecutePage]
})
export class ExecutePageModule {}
