import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaExcelPageComponent } from './carga-excel-page.component';

describe('CargaExcelPageComponent', () => {
  let component: CargaExcelPageComponent;
  let fixture: ComponentFixture<CargaExcelPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CargaExcelPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CargaExcelPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
