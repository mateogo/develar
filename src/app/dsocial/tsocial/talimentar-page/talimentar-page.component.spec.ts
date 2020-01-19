import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalimentarPageComponent } from './talimentar-page.component';

describe('TalimentarPageComponent', () => {
  let component: TalimentarPageComponent;
  let fixture: ComponentFixture<TalimentarPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalimentarPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalimentarPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
