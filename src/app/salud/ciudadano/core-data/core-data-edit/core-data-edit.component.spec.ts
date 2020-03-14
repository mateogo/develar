import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreDataEditComponent } from './core-data-edit.component';

describe('CoreDataEditComponent', () => {
  let component: CoreDataEditComponent;
  let fixture: ComponentFixture<CoreDataEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreDataEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
