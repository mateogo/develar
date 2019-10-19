import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolNocheEditComponent } from './rol-noche-edit.component';

describe('RolNocheEditComponent', () => {
  let component: RolNocheEditComponent;
  let fixture: ComponentFixture<RolNocheEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolNocheEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolNocheEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
