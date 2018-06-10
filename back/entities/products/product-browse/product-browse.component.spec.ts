import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductBrowseComponent } from './product-browse.component';

describe('ProductBrowseComponent', () => {
  let component: ProductBrowseComponent;
  let fixture: ComponentFixture<ProductBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
