import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitaAlimentosEditComponent } from './solicita-alimentos-edit.component';

describe('SolicitaAlimentosEditComponent', () => {
  let component: SolicitaAlimentosEditComponent;
  let fixture: ComponentFixture<SolicitaAlimentosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitaAlimentosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitaAlimentosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
