import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionesEditComponent } from './observaciones-edit.component';

describe('ObservacionesEditComponent', () => {
  let component: ObservacionesEditComponent;
  let fixture: ComponentFixture<ObservacionesEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
