import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestacadoComponent } from './destacado-fw.component';

describe('DestacadoComponent', () => {
  let component: DestacadoComponent;
  let fixture: ComponentFixture<DestacadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestacadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestacadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
