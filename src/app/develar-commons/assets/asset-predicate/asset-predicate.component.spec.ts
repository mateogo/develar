import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPredicateComponent } from './asset-predicate.component';

describe('AssetPredicateComponent', () => {
  let component: AssetPredicateComponent;
  let fixture: ComponentFixture<AssetPredicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetPredicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPredicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
