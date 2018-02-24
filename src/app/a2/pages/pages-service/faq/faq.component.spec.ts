import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA }          from '@angular/core';

import { PageFaqComponent } from './faq.component';

describe('PageFaqComponent', () => {
  let component: PageFaqComponent;
  let fixture: ComponentFixture<PageFaqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageFaqComponent ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
