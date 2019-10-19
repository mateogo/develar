import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComercioPageComponent } from './dashboard-comercio-page.component';

describe('DashboardComercioPageComponent', () => {
  let component: DashboardComercioPageComponent;
  let fixture: ComponentFixture<DashboardComercioPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardComercioPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComercioPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
