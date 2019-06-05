import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolListPageComponent } from './sol-list-page.component';

describe('SolListPageComponent', () => {
  let component: SolListPageComponent;
  let fixture: ComponentFixture<SolListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolListPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
