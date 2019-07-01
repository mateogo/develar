import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationBaseComponent } from './notification-base.component';

describe('NotificationBaseComponent', () => {
  let component: NotificationBaseComponent;
  let fixture: ComponentFixture<NotificationBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotificationBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
