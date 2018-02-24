import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationConversationComponent } from './notification-conversation.component';

describe('NotificationConversationComponent', () => {
  let component: NotificationConversationComponent;
  let fixture: ComponentFixture<NotificationConversationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationConversationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationConversationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
