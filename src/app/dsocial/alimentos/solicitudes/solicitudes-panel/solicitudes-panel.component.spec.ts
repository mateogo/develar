import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesPanelComponent } from './solicitudes-panel.component';

describe('SolicitudesPanelComponent', () => {
  let component: SolicitudesPanelComponent;
  let fixture: ComponentFixture<SolicitudesPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
