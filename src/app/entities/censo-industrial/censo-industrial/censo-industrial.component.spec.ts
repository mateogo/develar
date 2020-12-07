import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CensoIndustrialComponent } from './censo-industrial.component';

describe('CensoIndustrialComponent', () => {
  let component: CensoIndustrialComponent;
  let fixture: ComponentFixture<CensoIndustrialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CensoIndustrialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CensoIndustrialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
