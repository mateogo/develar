import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioCoreBaseComponent } from './comercio-core-base.component';

describe('ComercioCoreBaseComponent', () => {
  let component: ComercioCoreBaseComponent;
  let fixture: ComponentFixture<ComercioCoreBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioCoreBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioCoreBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
