import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioMembersPanelComponent } from './comercio-members-panel.component';

describe('ComercioMembersPanelComponent', () => {
  let component: ComercioMembersPanelComponent;
  let fixture: ComponentFixture<ComercioMembersPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioMembersPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioMembersPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
