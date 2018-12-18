import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LasargenNavbarComponent } from './lasargen-navbar.component';

describe('LasargenNavbarComponent', () => {
  let component: LasargenNavbarComponent;
  let fixture: ComponentFixture<LasargenNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LasargenNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LasargenNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
