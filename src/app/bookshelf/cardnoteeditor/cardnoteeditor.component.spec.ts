import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardnoteeditorComponent } from './cardnoteeditor.component';

describe('CardnoteeditorComponent', () => {
  let component: CardnoteeditorComponent;
  let fixture: ComponentFixture<CardnoteeditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardnoteeditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardnoteeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
