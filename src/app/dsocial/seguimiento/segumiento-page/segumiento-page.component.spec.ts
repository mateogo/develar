import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SegumientoPageComponent } from './segumiento-page.component';

describe('SegumientoPageComponent', () => {
  let component: SegumientoPageComponent;
  let fixture: ComponentFixture<SegumientoPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegumientoPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegumientoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
