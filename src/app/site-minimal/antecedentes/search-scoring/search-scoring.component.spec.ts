import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchScoringComponent } from './search-scoring.component';

describe('SearchScoringComponent', () => {
  let component: SearchScoringComponent;
  let fixture: ComponentFixture<SearchScoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchScoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchScoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
