import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExecutePage } from './execute.page';

describe('ExecutePage', () => {
  let component: ExecutePage;
  let fixture: ComponentFixture<ExecutePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExecutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
