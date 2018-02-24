import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoldereditComponent } from './folderedit.component';

describe('FoldereditComponent', () => {
  let component: FoldereditComponent;
  let fixture: ComponentFixture<FoldereditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoldereditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoldereditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
