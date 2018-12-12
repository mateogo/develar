import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLeafletMapComponent } from './leaflet-map.component';

describe('PageLeafletMapComponent', () => {
  let component: PageLeafletMapComponent;
  let fixture: ComponentFixture<PageLeafletMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageLeafletMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLeafletMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
