import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductKitListComponent } from './product-kit-list.component';

describe('ProductKitListComponent', () => {
  let component: ProductKitListComponent;
  let fixture: ComponentFixture<ProductKitListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductKitListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductKitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
