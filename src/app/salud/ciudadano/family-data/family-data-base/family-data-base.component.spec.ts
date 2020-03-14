import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyDataBaseComponent } from './family-data-base.component';

describe('FamilyDataBaseComponent', () => {
  let component: FamilyDataBaseComponent;
  let fixture: ComponentFixture<FamilyDataBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyDataBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyDataBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
