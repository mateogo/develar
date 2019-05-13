import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreDataViewComponent } from './core-data-view.component';

describe('CoreDataViewComponent', () => {
  let component: CoreDataViewComponent;
  let fixture: ComponentFixture<CoreDataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreDataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
