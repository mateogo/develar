import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardgraphComponent } from './cardgraph.component';

describe('CardgraphComponent', () => {
  let component: CardgraphComponent;
  let fixture: ComponentFixture<CardgraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardgraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
