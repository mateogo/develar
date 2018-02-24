import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductitTableComponent } from './productit-table.component';

describe('ProductitTableComponent', () => {
  let component: ProductitTableComponent;
  let fixture: ComponentFixture<ProductitTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductitTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductitTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
