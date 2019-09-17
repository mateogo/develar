import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitaEncuestaEditComponent } from './solicita-encuesta-edit.component';

describe('SolicitaEncuestaEditComponent', () => {
  let component: SolicitaEncuestaEditComponent;
  let fixture: ComponentFixture<SolicitaEncuestaEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitaEncuestaEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitaEncuestaEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
