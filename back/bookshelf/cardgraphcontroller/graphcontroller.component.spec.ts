import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphcontrollerComponent } from './graphcontroller.component';

describe('GraphcontrollerComponent', () => {
  let component: GraphcontrollerComponent;
  let fixture: ComponentFixture<GraphcontrollerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphcontrollerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphcontrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
