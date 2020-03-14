import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoberturaDataBaseComponent } from './cobertura-data-base.component';

describe('CoberturaDataBaseComponent', () => {
  let component: CoberturaDataBaseComponent;
  let fixture: ComponentFixture<CoberturaDataBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoberturaDataBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoberturaDataBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
