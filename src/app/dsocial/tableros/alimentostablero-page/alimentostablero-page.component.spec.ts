import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlimentostableroPageComponent } from './alimentostablero-page.component';

describe('AlimentostableroPageComponent', () => {
  let component: AlimentostableroPageComponent;
  let fixture: ComponentFixture<AlimentostableroPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlimentostableroPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlimentostableroPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
