import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionesBaseComponent } from './observaciones-base.component';

describe('ObservacionesBaseComponent', () => {
  let component: ObservacionesBaseComponent;
  let fixture: ComponentFixture<ObservacionesBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionesBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionesBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
