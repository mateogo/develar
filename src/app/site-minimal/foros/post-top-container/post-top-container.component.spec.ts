import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTopContainerComponent } from './post-top-container.component';

describe('PostTopContainerComponent', () => {
  let component: PostTopContainerComponent;
  let fixture: ComponentFixture<PostTopContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostTopContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostTopContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
