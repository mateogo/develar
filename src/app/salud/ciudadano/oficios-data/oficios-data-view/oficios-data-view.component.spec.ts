import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OficiosDataViewComponent } from './oficios-data-view.component';

describe('OficiosDataViewComponent', () => {
  let component: OficiosDataViewComponent;
  let fixture: ComponentFixture<OficiosDataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OficiosDataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OficiosDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
