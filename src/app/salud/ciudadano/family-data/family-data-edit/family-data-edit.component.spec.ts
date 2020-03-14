import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyDataEditComponent } from './family-data-edit.component';

describe('FamilyDataEditComponent', () => {
  let component: FamilyDataEditComponent;
  let fixture: ComponentFixture<FamilyDataEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyDataEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
