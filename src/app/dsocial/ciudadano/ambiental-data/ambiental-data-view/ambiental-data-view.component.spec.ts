import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbientalDataViewComponent } from './ambiental-data-view.component';

describe('AmbientalDataViewComponent', () => {
  let component: AmbientalDataViewComponent;
  let fixture: ComponentFixture<AmbientalDataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmbientalDataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbientalDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
