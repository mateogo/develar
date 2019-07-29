import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaludDataViewComponent } from './salud-data-view.component';

describe('SaludDataViewComponent', () => {
  let component: SaludDataViewComponent;
  let fixture: ComponentFixture<SaludDataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaludDataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaludDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
