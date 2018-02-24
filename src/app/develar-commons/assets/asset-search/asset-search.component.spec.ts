import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSearchComponent } from './asset-search.component';

describe('AssetSearchComponent', () => {
  let component: AssetSearchComponent;
  let fixture: ComponentFixture<AssetSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
