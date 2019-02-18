import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDetailContainerComponent } from './post-detail-container.component';

describe('PostDetailContainerComponent', () => {
  let component: PostDetailContainerComponent;
  let fixture: ComponentFixture<PostDetailContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostDetailContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostDetailContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
