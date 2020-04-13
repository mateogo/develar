import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BufferModalComponent } from './buffer-modal.component';

describe('BufferModalComponent', () => {
  let component: BufferModalComponent;
  let fixture: ComponentFixture<BufferModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BufferModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BufferModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
