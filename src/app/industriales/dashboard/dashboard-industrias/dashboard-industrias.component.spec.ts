import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardIndustriasComponent } from './dashboard-industrias.component';

describe('DashboardIndustriasComponent', () => {
  let component: DashboardIndustriasComponent;
  let fixture: ComponentFixture<DashboardIndustriasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardIndustriasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardIndustriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
