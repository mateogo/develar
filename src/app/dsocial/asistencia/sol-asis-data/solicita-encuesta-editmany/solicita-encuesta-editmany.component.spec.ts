import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitaEncuestaEditmanyComponent } from './solicita-encuesta-editmany.component';

describe('SolicitaEncuestaEditmanyComponent', () => {
  let component: SolicitaEncuestaEditmanyComponent;
  let fixture: ComponentFixture<SolicitaEncuestaEditmanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitaEncuestaEditmanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitaEncuestaEditmanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
