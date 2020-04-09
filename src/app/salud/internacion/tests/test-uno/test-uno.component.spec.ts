import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestUnoComponent } from './test-uno.component';

describe('TestUnoComponent', () => {
  let component: TestUnoComponent;
  let fixture: ComponentFixture<TestUnoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestUnoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestUnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
