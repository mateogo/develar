import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsnAssignComponent } from './productsn-assign.component';

describe('ProductsnAssignComponent', () => {
  let component: ProductsnAssignComponent;
  let fixture: ComponentFixture<ProductsnAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsnAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsnAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
