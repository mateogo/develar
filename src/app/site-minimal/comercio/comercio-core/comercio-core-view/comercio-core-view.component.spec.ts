import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioCoreViewComponent } from './comercio-core-view.component';

describe('ComercioCoreViewComponent', () => {
  let component: ComercioCoreViewComponent;
  let fixture: ComponentFixture<ComercioCoreViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioCoreViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioCoreViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
