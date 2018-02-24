import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldercreateComponent } from './foldercreate.component';

describe('FoldercreateComponent', () => {
  let component: FoldercreateComponent;
  let fixture: ComponentFixture<FoldercreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoldercreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoldercreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
