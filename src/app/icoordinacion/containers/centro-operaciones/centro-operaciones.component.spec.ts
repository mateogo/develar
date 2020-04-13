import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroOperacionesComponent } from './centro-operaciones.component';

describe('CentroOperacionesComponent', () => {
  let component: CentroOperacionesComponent;
  let fixture: ComponentFixture<CentroOperacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CentroOperacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroOperacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
