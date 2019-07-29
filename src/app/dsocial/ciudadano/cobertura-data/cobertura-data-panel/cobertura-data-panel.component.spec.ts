import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoberturaDataPanelComponent } from './cobertura-data-panel.component';

describe('CoberturaDataPanelComponent', () => {
  let component: CoberturaDataPanelComponent;
  let fixture: ComponentFixture<CoberturaDataPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoberturaDataPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoberturaDataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
