import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PorfolioCarrouselPageComponent } from './porfolio-carrousel-page.component';

describe('PorfolioCarrouselPageComponent', () => {
  let component: PorfolioCarrouselPageComponent;
  let fixture: ComponentFixture<PorfolioCarrouselPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PorfolioCarrouselPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PorfolioCarrouselPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
