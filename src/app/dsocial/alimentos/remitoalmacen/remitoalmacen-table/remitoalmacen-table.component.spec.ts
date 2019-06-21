import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitoalmacenTableComponent } from './remitoalmacen-table.component';

describe('RemitoalmacenTableComponent', () => {
  let component: RemitoalmacenTableComponent;
  let fixture: ComponentFixture<RemitoalmacenTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemitoalmacenTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitoalmacenTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
