import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyDataPanelComponent } from './family-data-panel.component';

describe('FamilyDataPanelComponent', () => {
  let component: FamilyDataPanelComponent;
  let fixture: ComponentFixture<FamilyDataPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyDataPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyDataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
