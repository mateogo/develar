import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopFooterPageComponent } from './top-footer-page.component';

describe('TopFooterPageComponent', () => {
  let component: TopFooterPageComponent;
  let fixture: ComponentFixture<TopFooterPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopFooterPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopFooterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
