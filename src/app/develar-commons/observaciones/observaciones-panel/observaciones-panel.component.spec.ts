import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionesPanelComponent } from './observaciones-panel.component';

describe('ObservacionesPanelComponent', () => {
  let component: ObservacionesPanelComponent;
  let fixture: ComponentFixture<ObservacionesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservacionesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
