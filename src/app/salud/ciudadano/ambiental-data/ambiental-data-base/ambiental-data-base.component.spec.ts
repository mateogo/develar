import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbientalDataBaseComponent } from './ambiental-data-base.component';

describe('AmbientalDataBaseComponent', () => {
  let component: AmbientalDataBaseComponent;
  let fixture: ComponentFixture<AmbientalDataBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmbientalDataBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbientalDataBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
