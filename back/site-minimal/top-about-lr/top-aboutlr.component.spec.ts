import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopAboutlrComponent } from './top-aboutlr.component';

describe('TopAboutlrComponent', () => {
  let component: TopAboutlrComponent;
  let fixture: ComponentFixture<TopAboutlrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopAboutlrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopAboutlrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
