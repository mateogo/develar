import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroContainerComponent } from './registro-container.component';

describe('RegistroContainerComponent', () => {
  let component: RegistroContainerComponent;
  let fixture: ComponentFixture<RegistroContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
