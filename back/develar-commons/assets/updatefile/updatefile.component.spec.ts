import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatefileComponent } from './updatefile.component';

describe('UpdatefileComponent', () => {
  let component: UpdatefileComponent;
  let fixture: ComponentFixture<UpdatefileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatefileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatefileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
