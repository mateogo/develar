import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GcseComponent } from './gcse.component';

describe('GcseComponent', () => {
  let component: GcseComponent;
  let fixture: ComponentFixture<GcseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GcseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GcseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
