import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoberturaDataViewComponent } from './cobertura-data-view.component';

describe('CoberturaDataViewComponent', () => {
  let component: CoberturaDataViewComponent;
  let fixture: ComponentFixture<CoberturaDataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoberturaDataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoberturaDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
