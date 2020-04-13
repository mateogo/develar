import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapacidadComponent } from './capacidad.component';

describe('CapacidadComponent', () => {
  let component: CapacidadComponent;
  let fixture: ComponentFixture<CapacidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapacidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapacidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
