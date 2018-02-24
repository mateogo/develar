import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NIHTimelineComponent } from './ni-h-timeline.component';

describe('NIHTimelineComponent', () => {
  let component: NIHTimelineComponent;
  let fixture: ComponentFixture<NIHTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NIHTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NIHTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
