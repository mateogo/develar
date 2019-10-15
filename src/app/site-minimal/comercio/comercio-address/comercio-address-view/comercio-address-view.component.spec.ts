import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioAddressViewComponent } from './comercio-address-view.component';

describe('ComercioAddressViewComponent', () => {
  let component: ComercioAddressViewComponent;
  let fixture: ComponentFixture<ComercioAddressViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioAddressViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioAddressViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
