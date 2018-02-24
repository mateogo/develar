import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitcardviewComponent } from './unitcardview.component';

describe('UnitcardviewComponent', () => {
  let component: UnitcardviewComponent;
  let fixture: ComponentFixture<UnitcardviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitcardviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitcardviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
