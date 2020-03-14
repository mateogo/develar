import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolasisBrowseComponent } from './solasis-browse.component';

describe('SolasisBrowseComponent', () => {
  let component: SolasisBrowseComponent;
  let fixture: ComponentFixture<SolasisBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolasisBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolasisBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
