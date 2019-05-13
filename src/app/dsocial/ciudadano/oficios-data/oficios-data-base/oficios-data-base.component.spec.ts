import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OficiosDataBaseComponent } from './oficios-data-base.component';

describe('OficiosDataBaseComponent', () => {
  let component: OficiosDataBaseComponent;
  let fixture: ComponentFixture<OficiosDataBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OficiosDataBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OficiosDataBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
