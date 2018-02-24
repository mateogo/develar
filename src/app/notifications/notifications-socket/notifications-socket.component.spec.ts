import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsSocketComponent } from './notifications-socket.component';

describe('NotificationsSocketComponent', () => {
  let component: NotificationsSocketComponent;
  let fixture: ComponentFixture<NotificationsSocketComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationsSocketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsSocketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
