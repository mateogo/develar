import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageFilteringTableComponent } from './filtering-table.component';

describe('PageFilteringTableComponent', () => {
  let component: PageFilteringTableComponent;
  let fixture: ComponentFixture<PageFilteringTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageFilteringTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageFilteringTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
