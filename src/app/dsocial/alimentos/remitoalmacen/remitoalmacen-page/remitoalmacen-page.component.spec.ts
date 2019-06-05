import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitoalmacenPageComponent } from './remitoalmacen-page.component';

describe('RemitoalmacenPageComponent', () => {
  let component: RemitoalmacenPageComponent;
  let fixture: ComponentFixture<RemitoalmacenPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemitoalmacenPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitoalmacenPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
