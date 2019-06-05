import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlimentosPageComponent } from './alimentos-page.component';

describe('AlimentosPageComponent', () => {
  let component: AlimentosPageComponent;
  let fixture: ComponentFixture<AlimentosPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlimentosPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlimentosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
