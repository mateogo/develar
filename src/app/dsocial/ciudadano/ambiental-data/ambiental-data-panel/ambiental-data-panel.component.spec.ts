import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbientalDataPanelComponent } from './ambiental-data-panel.component';

describe('AmbientalDataPanelComponent', () => {
  let component: AmbientalDataPanelComponent;
  let fixture: ComponentFixture<AmbientalDataPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmbientalDataPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbientalDataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
