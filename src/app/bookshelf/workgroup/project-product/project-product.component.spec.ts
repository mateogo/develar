import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectProductComponent } from './project-product.component';

describe('ProjectProductComponent', () => {
  let component: ProjectProductComponent;
  let fixture: ComponentFixture<ProjectProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
