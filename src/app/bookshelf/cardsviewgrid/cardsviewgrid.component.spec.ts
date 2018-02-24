import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsviewgridComponent } from './cardsviewgrid.component';

describe('CardsviewgridComponent', () => {
  let component: CardsviewgridComponent;
  let fixture: ComponentFixture<CardsviewgridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardsviewgridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardsviewgridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
