import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitoModalComponent } from './transito-modal.component';

describe('TransitoModalComponent', () => {
  let component: TransitoModalComponent;
  let fixture: ComponentFixture<TransitoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransitoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
