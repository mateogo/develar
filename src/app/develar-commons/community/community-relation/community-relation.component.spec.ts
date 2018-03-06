import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityRelationComponent } from './community-relation.component';

describe('CommunityRelationComponent', () => {
  let component: CommunityRelationComponent;
  let fixture: ComponentFixture<CommunityRelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityRelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
