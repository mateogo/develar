import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoCreateComponent } from './turno-create.component';

describe('TurnoCreateComponent', () => {
  let component: TurnoCreateComponent;
  let fixture: ComponentFixture<TurnoCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnoCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
