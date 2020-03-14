import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDataEditComponent } from './address-data-edit.component';

describe('AddressDataEditComponent', () => {
  let component: AddressDataEditComponent;
  let fixture: ComponentFixture<AddressDataEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressDataEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
