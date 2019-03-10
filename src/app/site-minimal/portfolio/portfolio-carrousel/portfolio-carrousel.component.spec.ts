import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioCarrouselComponent } from './portfolio-carrousel.component';

describe('PortfolioCarrouselComponent', () => {
  let component: PortfolioCarrouselComponent;
  let fixture: ComponentFixture<PortfolioCarrouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioCarrouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioCarrouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
