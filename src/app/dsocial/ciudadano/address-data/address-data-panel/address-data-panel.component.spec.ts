import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDataPanelComponent } from './address-data-panel.component';

describe('AddressDataPanelComponent', () => {
  let component: AddressDataPanelComponent;
  let fixture: ComponentFixture<AddressDataPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressDataPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressDataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
