import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressEvalViewComponent } from './address-eval-view.component';

describe('AddressEvalViewComponent', () => {
  let component: AddressEvalViewComponent;
  let fixture: ComponentFixture<AddressEvalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressEvalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressEvalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
