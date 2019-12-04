import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionesViewComponent } from './observaciones-view.component';

describe('ObservacionesViewComponent', () => {
  let component: ObservacionesViewComponent;
  let fixture: ComponentFixture<ObservacionesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
