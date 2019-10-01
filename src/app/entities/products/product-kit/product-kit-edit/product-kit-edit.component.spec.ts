import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductKitEditComponent } from './product-kit-edit.component';

describe('ProductKitEditComponent', () => {
  let component: ProductKitEditComponent;
  let fixture: ComponentFixture<ProductKitEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductKitEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductKitEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
