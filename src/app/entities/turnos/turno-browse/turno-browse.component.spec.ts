import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoBrowseComponent } from './turno-browse.component';

describe('TurnoBrowseComponent', () => {
  let component: TurnoBrowseComponent;
  let fixture: ComponentFixture<TurnoBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TurnoBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TurnoBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
