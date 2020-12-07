import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CensoIndustrialTableComponent } from './censo-industrial-table.component';

describe('CensoIndustrialTableComponent', () => {
  let component: CensoIndustrialTableComponent;
  let fixture: ComponentFixture<CensoIndustrialTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CensoIndustrialTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CensoIndustrialTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
