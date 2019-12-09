import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExecutionPage } from './execution.page';

describe('ExecutionPage', () => {
  let component: ExecutionPage;
  let fixture: ComponentFixture<ExecutionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExecutionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
