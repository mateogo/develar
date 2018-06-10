import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuesCreateComponent } from './issues-create.component';

describe('IssuesCreateComponent', () => {
  let component: IssuesCreateComponent;
  let fixture: ComponentFixture<IssuesCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuesCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
