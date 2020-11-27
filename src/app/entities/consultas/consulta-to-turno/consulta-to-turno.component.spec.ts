import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaToTurnoComponent } from './consulta-to-turno.component';

describe('ConsultaToTurnoComponent', () => {
  let component: ConsultaToTurnoComponent;
  let fixture: ComponentFixture<ConsultaToTurnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaToTurnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaToTurnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
