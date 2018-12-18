import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopPortfolioComponent } from './top-portfolio.component';

describe('TopPortfolioComponent', () => {
  let component: TopPortfolioComponent;
  let fixture: ComponentFixture<TopPortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopPortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
