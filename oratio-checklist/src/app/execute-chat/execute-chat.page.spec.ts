import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExecuteChatPage } from './execute-chat.page';

describe('ExecuteChatPage', () => {
  let component: ExecuteChatPage;
  let fixture: ComponentFixture<ExecuteChatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecuteChatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExecuteChatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
