import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductgraphComponent } from './productgraph.component';

describe('ProductgraphComponent', () => {
  let component: ProductgraphComponent;
  let fixture: ComponentFixture<ProductgraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductgraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
