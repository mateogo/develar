import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAntecedentesComponent } from './search-antecedentes.component';

describe('SearchAntecedentesComponent', () => {
  let component: SearchAntecedentesComponent;
  let fixture: ComponentFixture<SearchAntecedentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchAntecedentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAntecedentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
