import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoberturaDataEditComponent } from './cobertura-data-edit.component';

describe('CoberturaDataEditComponent', () => {
  let component: CoberturaDataEditComponent;
  let fixture: ComponentFixture<CoberturaDataEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoberturaDataEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoberturaDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
