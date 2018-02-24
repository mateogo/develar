import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopBrandingComponent } from './top-branding.component';

describe('TopBrandingComponent', () => {
  let component: TopBrandingComponent;
  let fixture: ComponentFixture<TopBrandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopBrandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopBrandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
