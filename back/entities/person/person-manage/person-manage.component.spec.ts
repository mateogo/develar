import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonManageComponent } from './person-manage.component';

describe('PersonManageComponent', () => {
  let component: PersonManageComponent;
  let fixture: ComponentFixture<PersonManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonManageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
