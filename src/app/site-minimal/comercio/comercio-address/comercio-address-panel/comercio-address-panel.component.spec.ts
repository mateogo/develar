import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioAddressPanelComponent } from './comercio-address-panel.component';

describe('ComercioAddressPanelComponent', () => {
  let component: ComercioAddressPanelComponent;
  let fixture: ComponentFixture<ComercioAddressPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioAddressPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioAddressPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
