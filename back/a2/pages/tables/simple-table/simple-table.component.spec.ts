import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PageSimpleTableComponent } from './simple-table.component';

describe('PageSimpleTableComponent', () => {
  let component: PageSimpleTableComponent;
  let fixture: ComponentFixture<PageSimpleTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageSimpleTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSimpleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
