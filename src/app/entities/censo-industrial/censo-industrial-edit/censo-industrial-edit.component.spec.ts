import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CensoIndustrialEditComponent } from './censo-industrial-edit.component';

describe('CensoIndustrialEditComponent', () => {
  let component: CensoIndustrialEditComponent;
  let fixture: ComponentFixture<CensoIndustrialEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CensoIndustrialEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CensoIndustrialEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
