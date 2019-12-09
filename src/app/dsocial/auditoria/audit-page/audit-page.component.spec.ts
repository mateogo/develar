import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditPageComponent } from './audit-page.component';

describe('AuditPageComponent', () => {
  let component: AuditPageComponent;
  let fixture: ComponentFixture<AuditPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
