import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsnCreateComponent } from './productsn-create.component';

describe('ProductsnCreateComponent', () => {
  let component: ProductsnCreateComponent;
  let fixture: ComponentFixture<ProductsnCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsnCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsnCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
