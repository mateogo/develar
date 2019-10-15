import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioAddressEditComponent } from './comercio-address-edit.component';

describe('ComercioAddressEditComponent', () => {
  let component: ComercioAddressEditComponent;
  let fixture: ComponentFixture<ComercioAddressEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioAddressEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioAddressEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
