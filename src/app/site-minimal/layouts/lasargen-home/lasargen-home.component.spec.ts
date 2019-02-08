import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LasargenHomeNavbarComponent } from './lasargen-home.component';

describe('LasargenHomeNavbarComponent', () => {
  let component: LasargenHomeNavbarComponent;
  let fixture: ComponentFixture<LasargenHomeNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LasargenHomeNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LasargenHomeNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
