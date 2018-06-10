import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterSiteComponent } from './enter-site.component';

describe('EnterSiteComponent', () => {
  let component: EnterSiteComponent;
  let fixture: ComponentFixture<EnterSiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterSiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterSiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
