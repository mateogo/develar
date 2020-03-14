import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonAltaComponent } from './person-alta.component';

describe('PersonAltaComponent', () => {
  let component: PersonAltaComponent;
  let fixture: ComponentFixture<PersonAltaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonAltaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonAltaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
