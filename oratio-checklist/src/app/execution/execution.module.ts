import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExecutionPageRoutingModule } from './execution-routing.module';

import { ExecutionPage } from './execution.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExecutionPageRoutingModule
  ],
  declarations: [ExecutionPage]
})
export class ExecutionPageModule {}
