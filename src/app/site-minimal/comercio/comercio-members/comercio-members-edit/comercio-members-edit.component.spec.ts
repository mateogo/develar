import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioMembersEditComponent } from './comercio-members-edit.component';

describe('ComercioMembersEditComponent', () => {
  let component: ComercioMembersEditComponent;
  let fixture: ComponentFixture<ComercioMembersEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioMembersEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioMembersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
