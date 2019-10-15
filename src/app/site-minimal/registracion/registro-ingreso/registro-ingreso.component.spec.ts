import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroIngresoComponent } from './registro-ingreso.component';

describe('RegistroIngresoComponent', () => {
  let component: RegistroIngresoComponent;
  let fixture: ComponentFixture<RegistroIngresoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroIngresoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroIngresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
