import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreDataBaseComponent } from './core-data-base.component';

describe('CoreDataBaseComponent', () => {
  let component: CoreDataBaseComponent;
  let fixture: ComponentFixture<CoreDataBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreDataBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreDataBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
