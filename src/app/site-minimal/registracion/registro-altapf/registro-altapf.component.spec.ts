import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAltapfComponent } from './registro-altapf.component';

describe('RegistroAltapfComponent', () => {
  let component: RegistroAltapfComponent;
  let fixture: ComponentFixture<RegistroAltapfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroAltapfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroAltapfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
