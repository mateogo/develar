import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteeditorComponent } from './noteeditor.component';

describe('NoteeditorComponent', () => {
  let component: NoteeditorComponent;
  let fixture: ComponentFixture<NoteeditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteeditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
