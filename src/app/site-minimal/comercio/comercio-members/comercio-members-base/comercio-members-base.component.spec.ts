import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioMembersBaseComponent } from './comercio-members-base.component';

describe('ComercioMembersBaseComponent', () => {
  let component: ComercioMembersBaseComponent;
  let fixture: ComponentFixture<ComercioMembersBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioMembersBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioMembersBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
