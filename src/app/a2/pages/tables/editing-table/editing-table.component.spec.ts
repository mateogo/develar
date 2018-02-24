import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEditingTableComponent } from './editing-table.component';

describe('PageEditingTableComponent', () => {
  let component: PageEditingTableComponent;
  let fixture: ComponentFixture<PageEditingTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageEditingTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageEditingTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
