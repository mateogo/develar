import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookshelfSearchComponent } from './bookshelf-search.component';

describe('BookshelfSearchComponent', () => {
  let component: BookshelfSearchComponent;
  let fixture: ComponentFixture<BookshelfSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookshelfSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookshelfSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
