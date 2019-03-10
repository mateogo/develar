import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PorfolioCarrouselComponent } from './porfolio-carrousel.component';

describe('PorfolioCarrouselComponent', () => {
  let component: PorfolioCarrouselComponent;
  let fixture: ComponentFixture<PorfolioCarrouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PorfolioCarrouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PorfolioCarrouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
