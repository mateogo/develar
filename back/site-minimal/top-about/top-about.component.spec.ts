import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopAboutComponent } from './top-about.component';

describe('TopAboutComponent', () => {
  let component: TopAboutComponent;
  let fixture: ComponentFixture<TopAboutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopAboutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
