import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowviewComponent } from './showview.component';

describe('ShowviewComponent', () => {
  let component: ShowviewComponent;
  let fixture: ComponentFixture<ShowviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
