import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnitcardComponent } from './unitcard.component';

describe('UnitcardComponent', () => {
  let component: UnitcardComponent;
  let fixture: ComponentFixture<UnitcardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnitcardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnitcardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
