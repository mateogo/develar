import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OficiosDataEditComponent } from './oficios-data-edit.component';

describe('OficiosDataEditComponent', () => {
  let component: OficiosDataEditComponent;
  let fixture: ComponentFixture<OficiosDataEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OficiosDataEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OficiosDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
