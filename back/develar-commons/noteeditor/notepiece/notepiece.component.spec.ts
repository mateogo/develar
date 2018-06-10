import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotepieceComponent } from './notepiece.component';

describe('NotepieceComponent', () => {
  let component: NotepieceComponent;
  let fixture: ComponentFixture<NotepieceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotepieceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotepieceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
