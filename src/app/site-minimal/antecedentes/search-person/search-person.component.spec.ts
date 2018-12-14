import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPersonComponent } from './search-person.component';

describe('SearchPersonComponent', () => {
  let component: SearchPersonComponent;
  let fixture: ComponentFixture<SearchPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
