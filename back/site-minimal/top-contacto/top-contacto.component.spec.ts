import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopContactoComponent } from './top-contacto.component';

describe('TopContactoComponent', () => {
  let component: TopContactoComponent;
  let fixture: ComponentFixture<TopContactoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopContactoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopContactoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
