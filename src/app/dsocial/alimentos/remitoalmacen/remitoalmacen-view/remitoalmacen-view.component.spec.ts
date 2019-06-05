import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitoalmacenViewComponent } from './remitoalmacen-view.component';

describe('RemitoalmacenViewComponent', () => {
  let component: RemitoalmacenViewComponent;
  let fixture: ComponentFixture<RemitoalmacenViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemitoalmacenViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitoalmacenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
