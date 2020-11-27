import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoEditComponent } from './turno-edit.component';

describe('TurnoEditComponent', () => {
  let component: TurnoEditComponent;
  let fixture: ComponentFixture<TurnoEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnoEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
