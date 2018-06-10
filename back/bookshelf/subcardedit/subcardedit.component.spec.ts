import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubcardeditComponent } from './subcardedit.component';

describe('SubcardeditComponent', () => {
  let component: SubcardeditComponent;
  let fixture: ComponentFixture<SubcardeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubcardeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubcardeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
