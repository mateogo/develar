import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteBaseComponent } from './note-base.component';

describe('NoteBaseComponent', () => {
  let component: NoteBaseComponent;
  let fixture: ComponentFixture<NoteBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoteBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
