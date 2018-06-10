import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowsepersonComponent } from './browseperson.component';

describe('BrowsepersonComponent', () => {
  let component: BrowsepersonComponent;
  let fixture: ComponentFixture<BrowsepersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowsepersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowsepersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
