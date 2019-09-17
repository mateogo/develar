import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolDashboardPageComponent } from './sol-dashboard-page.component';

describe('SolDashboardPageComponent', () => {
  let component: SolDashboardPageComponent;
  let fixture: ComponentFixture<SolDashboardPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolDashboardPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolDashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
