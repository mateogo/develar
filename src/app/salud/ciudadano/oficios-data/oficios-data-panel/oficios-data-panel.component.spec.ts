import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OficiosDataPanelComponent } from './oficios-data-panel.component';

describe('OficiosDataPanelComponent', () => {
  let component: OficiosDataPanelComponent;
  let fixture: ComponentFixture<OficiosDataPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OficiosDataPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OficiosDataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
