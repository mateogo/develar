import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlimentarDashboardComponent } from './alimentar-dashboard.component';

describe('AlimentarDashboardComponent', () => {
  let component: AlimentarDashboardComponent;
  let fixture: ComponentFixture<AlimentarDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlimentarDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlimentarDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
