import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioContactdataBaseComponent } from './comercio-contactdata-base.component';

describe('ComercioContactdataBaseComponent', () => {
  let component: ComercioContactdataBaseComponent;
  let fixture: ComponentFixture<ComercioContactdataBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioContactdataBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioContactdataBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
