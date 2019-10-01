import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlmacenSearchComponent } from './product-search.component';

describe('AlmacenSearchComponent', () => {
  let component: AlmacenSearchComponent;
  let fixture: ComponentFixture<AlmacenSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlmacenSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlmacenSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
