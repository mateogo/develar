import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroClaveComponent } from './registro-clave.component';

describe('RegistroClaveComponent', () => {
  let component: RegistroClaveComponent;
  let fixture: ComponentFixture<RegistroClaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroClaveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroClaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
