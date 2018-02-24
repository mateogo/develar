import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityBaseComponent } from './community-base.component';

describe('CommunityBaseComponent', () => {
  let component: CommunityBaseComponent;
  let fixture: ComponentFixture<CommunityBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
