import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitaEncuestaViewComponent } from './solicita-encuesta-view.component';

describe('SolicitaEncuestaViewComponent', () => {
  let component: SolicitaEncuestaViewComponent;
  let fixture: ComponentFixture<SolicitaEncuestaViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitaEncuestaViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitaEncuestaViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
