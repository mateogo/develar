import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationCreateComponent } from './notification-create.component';

describe('NotificationCreateComponent', () => {
  let component: NotificationCreateComponent;
  let fixture: ComponentFixture<NotificationCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
