import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistableroPageComponent } from './asistablero-page.component';

describe('AsistableroPageComponent', () => {
  let component: AsistableroPageComponent;
  let fixture: ComponentFixture<AsistableroPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsistableroPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistableroPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
