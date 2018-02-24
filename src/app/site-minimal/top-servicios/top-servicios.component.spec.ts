import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopServiciosComponent } from './top-servicios.component';

describe('TopServiciosComponent', () => {
  let component: TopServiciosComponent;
  let fixture: ComponentFixture<TopServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
