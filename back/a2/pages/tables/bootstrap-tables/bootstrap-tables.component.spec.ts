import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBootstrapTablesComponent } from './bootstrap-tables.component';

describe('PageBootstrapTablesComponent', () => {
  let component: PageBootstrapTablesComponent;
  let fixture: ComponentFixture<PageBootstrapTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageBootstrapTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageBootstrapTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
