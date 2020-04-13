import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosModalComponent } from './recursos-modal.component';

describe('RecursosModalComponent', () => {
  let component: RecursosModalComponent;
  let fixture: ComponentFixture<RecursosModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecursosModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
