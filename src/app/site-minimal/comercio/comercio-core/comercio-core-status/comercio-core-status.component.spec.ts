import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioCoreStatusComponent } from './comercio-core-status.component';

describe('ComercioCoreStatusComponent', () => {
  let component: ComercioCoreStatusComponent;
  let fixture: ComponentFixture<ComercioCoreStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioCoreStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioCoreStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
