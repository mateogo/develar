import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbientalDataEditComponent } from './ambiental-data-edit.component';

describe('AmbientalDataEditComponent', () => {
  let component: AmbientalDataEditComponent;
  let fixture: ComponentFixture<AmbientalDataEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmbientalDataEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbientalDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
