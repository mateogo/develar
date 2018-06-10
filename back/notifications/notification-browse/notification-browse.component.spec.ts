import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationBrowseComponent } from './notification-browse.component';

describe('NotificationBrowseComponent', () => {
  let component: NotificationBrowseComponent;
  let fixture: ComponentFixture<NotificationBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
