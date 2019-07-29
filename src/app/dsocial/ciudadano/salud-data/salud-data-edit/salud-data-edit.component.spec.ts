import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaludDataEditComponent } from './salud-data-edit.component';

describe('SaludDataEditComponent', () => {
  let component: SaludDataEditComponent;
  let fixture: ComponentFixture<SaludDataEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaludDataEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaludDataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
