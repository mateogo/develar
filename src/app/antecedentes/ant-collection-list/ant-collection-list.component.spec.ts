import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntCollectionListComponent } from './ant-collection-list.component';

describe('AntCollectionListComponent', () => {
  let component: AntCollectionListComponent;
  let fixture: ComponentFixture<AntCollectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntCollectionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntCollectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
