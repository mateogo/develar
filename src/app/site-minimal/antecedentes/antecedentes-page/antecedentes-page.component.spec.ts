import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AntecedentesPageComponent } from './antecedentes-page.component';

describe('AntecedentesPageComponent', () => {
  let component: AntecedentesPageComponent;
  let fixture: ComponentFixture<AntecedentesPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AntecedentesPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntecedentesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
