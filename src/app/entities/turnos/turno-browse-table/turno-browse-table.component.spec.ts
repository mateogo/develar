import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoBrowseTableComponent } from './turno-browse-table.component';

describe('TurnoBrowseTableComponent', () => {
  let component: TurnoBrowseTableComponent;
  let fixture: ComponentFixture<TurnoBrowseTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnoBrowseTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoBrowseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
