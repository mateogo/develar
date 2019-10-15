import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroAltaComponent } from './registro-alta.component';

describe('RegistroAltaComponent', () => {
  let component: RegistroAltaComponent;
  let fixture: ComponentFixture<RegistroAltaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroAltaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
