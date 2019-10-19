import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComerciosLayoutComponent } from './comercios-layout.component';

describe('ComerciosLayoutComponent', () => {
  let component: ComerciosLayoutComponent;
  let fixture: ComponentFixture<ComerciosLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComerciosLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComerciosLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
