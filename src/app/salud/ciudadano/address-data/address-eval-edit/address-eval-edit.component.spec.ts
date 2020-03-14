import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressEvalEditComponent } from './address-eval-edit.component';

describe('AddressEvalEditComponent', () => {
  let component: AddressEvalEditComponent;
  let fixture: ComponentFixture<AddressEvalEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressEvalEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressEvalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
