import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlimentostableroTableComponent } from './alimentostablero-table.component';

describe('AlimentostableroTableComponent', () => {
  let component: AlimentostableroTableComponent;
  let fixture: ComponentFixture<AlimentostableroTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlimentostableroTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlimentostableroTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
