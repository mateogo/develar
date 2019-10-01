import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductKitPageComponent } from './product-kit-page.component';

describe('ProductKitPageComponent', () => {
  let component: ProductKitPageComponent;
  let fixture: ComponentFixture<ProductKitPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductKitPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductKitPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
