import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsnTableComponent } from './productsn-table.component';

describe('ProductsnTableComponent', () => {
  let component: ProductsnTableComponent;
  let fixture: ComponentFixture<ProductsnTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductsnTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsnTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
