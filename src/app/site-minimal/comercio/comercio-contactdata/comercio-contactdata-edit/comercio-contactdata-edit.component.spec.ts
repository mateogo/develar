import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioContactdataEditComponent } from './comercio-contactdata-edit.component';

describe('ComercioContactdataEditComponent', () => {
  let component: ComercioContactdataEditComponent;
  let fixture: ComponentFixture<ComercioContactdataEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioContactdataEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioContactdataEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
