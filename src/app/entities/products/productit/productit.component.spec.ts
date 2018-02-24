import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductitComponent } from './productit.component';

describe('ProductitComponent', () => {
  let component: ProductitComponent;
  let fixture: ComponentFixture<ProductitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
