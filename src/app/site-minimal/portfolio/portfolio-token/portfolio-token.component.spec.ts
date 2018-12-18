import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortfolioTokenComponent } from './portfolio-token.component';

describe('PortfolioTokenComponent', () => {
  let component: PortfolioTokenComponent;
  let fixture: ComponentFixture<PortfolioTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortfolioTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortfolioTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
