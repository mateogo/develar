import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntCollectionPageComponent } from './ant-collection-page.component';

describe('AntCollectionPageComponent', () => {
  let component: AntCollectionPageComponent;
  let fixture: ComponentFixture<AntCollectionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntCollectionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntCollectionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
