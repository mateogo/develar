import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesInternacionModalComponent } from './solicitudes-internacion-modal.component';

describe('SolicitudesInternacionModalComponent', () => {
  let component: SolicitudesInternacionModalComponent;
  let fixture: ComponentFixture<SolicitudesInternacionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesInternacionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesInternacionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
