import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioContactdataViewComponent } from './comercio-contactdata-view.component';

describe('ComercioContactdataViewComponent', () => {
  let component: ComercioContactdataViewComponent;
  let fixture: ComponentFixture<ComercioContactdataViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioContactdataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioContactdataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
