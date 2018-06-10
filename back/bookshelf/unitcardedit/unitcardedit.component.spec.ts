import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitcardeditComponent } from './unitcardedit.component';

describe('UnitcardeditComponent', () => {
  let component: UnitcardeditComponent;
  let fixture: ComponentFixture<UnitcardeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitcardeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitcardeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
