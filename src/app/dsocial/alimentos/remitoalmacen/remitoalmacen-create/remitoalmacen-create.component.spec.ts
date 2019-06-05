import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitoalmacenCreateComponent } from './remitoalmacen-create.component';

describe('RemitoalmacenCreateComponent', () => {
  let component: RemitoalmacenCreateComponent;
  let fixture: ComponentFixture<RemitoalmacenCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemitoalmacenCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitoalmacenCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
