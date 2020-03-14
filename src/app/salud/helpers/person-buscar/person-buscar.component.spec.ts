import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonBuscarComponent } from './person-buscar.component';

describe('PersonBuscarComponent', () => {
  let component: PersonBuscarComponent;
  let fixture: ComponentFixture<PersonBuscarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonBuscarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
