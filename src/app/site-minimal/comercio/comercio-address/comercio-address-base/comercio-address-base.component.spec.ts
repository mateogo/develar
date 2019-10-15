import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioAddressBaseComponent } from './comercio-address-base.component';

describe('ComercioAddressBaseComponent', () => {
  let component: ComercioAddressBaseComponent;
  let fixture: ComponentFixture<ComercioAddressBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioAddressBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioAddressBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
