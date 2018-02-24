import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsseteditComponent } from './assetedit.component';

describe('AsseteditComponent', () => {
  let component: AsseteditComponent;
  let fixture: ComponentFixture<AsseteditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsseteditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsseteditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
