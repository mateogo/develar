import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCarrouselComponent } from './top-carrousel.component';

describe('TopCarrouselComponent', () => {
  let component: TopCarrouselComponent;
  let fixture: ComponentFixture<TopCarrouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopCarrouselComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopCarrouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
