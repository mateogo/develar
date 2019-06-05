import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolListTableComponent } from './sol-list-table.component';

describe('SolListTableComponent', () => {
  let component: SolListTableComponent;
  let fixture: ComponentFixture<SolListTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolListTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
