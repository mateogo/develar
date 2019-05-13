import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDataEditComponent } from './contact-data-edit.component';

describe('ContactDataEditComponent', () => {
  let component: ContactDataEditComponent;
  let fixture: ComponentFixture<ContactDataEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDataEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
