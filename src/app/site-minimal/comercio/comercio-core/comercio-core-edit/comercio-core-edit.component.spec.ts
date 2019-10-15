import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioCoreEditComponent } from './comercio-core-edit.component';

describe('ComercioCoreEditComponent', () => {
  let component: ComercioCoreEditComponent;
  let fixture: ComponentFixture<ComercioCoreEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioCoreEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioCoreEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
