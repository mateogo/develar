import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesBaseComponent } from './solicitudes-base.component';

describe('SolicitudesBaseComponent', () => {
  let component: SolicitudesBaseComponent;
  let fixture: ComponentFixture<SolicitudesBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudesBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudesBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
