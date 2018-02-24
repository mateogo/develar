import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA }          from '@angular/core';

import { UserSignIn1Component } from './sign-in-1.component';

describe('UserSignIn1Component', () => {
  let component: UserSignIn1Component;
  let fixture: ComponentFixture<UserSignIn1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSignIn1Component ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSignIn1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
