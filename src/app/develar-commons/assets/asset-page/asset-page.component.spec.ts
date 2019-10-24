import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetPageComponent } from './asset-page.component';

describe('AssetPageComponent', () => {
  let component: AssetPageComponent;
  let fixture: ComponentFixture<AssetPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
