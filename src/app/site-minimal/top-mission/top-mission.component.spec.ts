import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMissionComponent } from './top-mission.component';

describe('TopMissionComponent', () => {
  let component: TopMissionComponent;
  let fixture: ComponentFixture<TopMissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopMissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopMissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
