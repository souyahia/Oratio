import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SearchHelperPage } from './search-helper.page';

describe('SearchHelperPage', () => {
  let component: SearchHelperPage;
  let fixture: ComponentFixture<SearchHelperPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchHelperPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchHelperPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
