import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioMembersViewComponent } from './comercio-members-view.component';

describe('ComercioMembersViewComponent', () => {
  let component: ComercioMembersViewComponent;
  let fixture: ComponentFixture<ComercioMembersViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioMembersViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioMembersViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
