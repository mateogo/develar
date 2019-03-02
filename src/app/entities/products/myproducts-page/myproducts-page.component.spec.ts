import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyproductsPageComponent } from './myproducts-page.component';

describe('MyproductsPageComponent', () => {
  let component: MyproductsPageComponent;
  let fixture: ComponentFixture<MyproductsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyproductsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyproductsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
