import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDataViewComponent } from './address-data-view.component';

describe('AddressDataViewComponent', () => {
  let component: AddressDataViewComponent;
  let fixture: ComponentFixture<AddressDataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressDataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
