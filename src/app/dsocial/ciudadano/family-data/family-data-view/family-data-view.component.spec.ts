import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyDataViewComponent } from './family-data-view.component';

describe('FamilyDataViewComponent', () => {
  let component: FamilyDataViewComponent;
  let fixture: ComponentFixture<FamilyDataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyDataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
