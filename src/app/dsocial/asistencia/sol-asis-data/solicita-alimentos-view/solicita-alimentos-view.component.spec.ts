import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitaAlimentosViewComponent } from './solicita-alimentos-view.component';

describe('SolicitaAlimentosViewComponent', () => {
  let component: SolicitaAlimentosViewComponent;
  let fixture: ComponentFixture<SolicitaAlimentosViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitaAlimentosViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitaAlimentosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
