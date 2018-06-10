import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsviewlistComponent } from './cardsviewlist.component';

describe('CardsviewlistComponent', () => {
  let component: CardsviewlistComponent;
  let fixture: ComponentFixture<CardsviewlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsviewlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsviewlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
