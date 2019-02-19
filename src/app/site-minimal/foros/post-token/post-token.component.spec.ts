import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTokenComponent } from './post-token.component';

describe('PostTokenComponent', () => {
  let component: PostTokenComponent;
  let fixture: ComponentFixture<PostTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
