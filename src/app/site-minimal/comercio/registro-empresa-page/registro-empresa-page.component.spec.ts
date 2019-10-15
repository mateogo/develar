import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEmpresaPageComponent } from './registro-empresa-page.component';

describe('RegistroEmpresaPageComponent', () => {
  let component: RegistroEmpresaPageComponent;
  let fixture: ComponentFixture<RegistroEmpresaPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroEmpresaPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroEmpresaPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
