import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDataViewComponent } from './contact-data-view.component';

describe('ContactDataViewComponent', () => {
  let component: ContactDataViewComponent;
  let fixture: ComponentFixture<ContactDataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactDataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
