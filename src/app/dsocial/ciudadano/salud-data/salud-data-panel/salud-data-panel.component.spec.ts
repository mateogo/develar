import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaludDataPanelComponent } from './salud-data-panel.component';

describe('SaludDataPanelComponent', () => {
  let component: SaludDataPanelComponent;
  let fixture: ComponentFixture<SaludDataPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaludDataPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaludDataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
