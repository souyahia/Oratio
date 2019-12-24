import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PersonSettingsPage } from './person-settings.page';

describe('PersonSettingsPage', () => {
  let component: PersonSettingsPage;
  let fixture: ComponentFixture<PersonSettingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonSettingsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonSettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
