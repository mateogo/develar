import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcardviewComponent } from './subcardview.component';

describe('SubcardviewComponent', () => {
  let component: SubcardviewComponent;
  let fixture: ComponentFixture<SubcardviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcardviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcardviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
