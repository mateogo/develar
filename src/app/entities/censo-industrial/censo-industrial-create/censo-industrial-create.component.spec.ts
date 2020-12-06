import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CensoIndustrialCreateComponent } from './censo-industrial-create.component';

describe('CensoIndustrialCreateComponent', () => {
  let component: CensoIndustrialCreateComponent;
  let fixture: ComponentFixture<CensoIndustrialCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CensoIndustrialCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CensoIndustrialCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
