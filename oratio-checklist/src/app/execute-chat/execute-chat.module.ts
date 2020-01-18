import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ExecuteChatPageRoutingModule } from './execute-chat-routing.module';

import { ExecuteChatPage } from './execute-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ExecuteChatPageRoutingModule
  ],
  declarations: [ExecuteChatPage]
})
export class ExecuteChatPageModule {}
