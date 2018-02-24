import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunitySelectorComponent } from './community-selector.component';

describe('CommunitySelectorComponent', () => {
  let component: CommunitySelectorComponent;
  let fixture: ComponentFixture<CommunitySelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunitySelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunitySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
