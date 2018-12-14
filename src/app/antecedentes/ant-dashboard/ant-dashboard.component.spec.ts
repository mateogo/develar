import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntDashboardComponent } from './ant-dashboard.component';

describe('AntDashboardComponent', () => {
  let component: AntDashboardComponent;
  let fixture: ComponentFixture<AntDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
