import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComercioContactdataPanelComponent } from './comercio-contactdata-panel.component';

describe('ComercioContactdataPanelComponent', () => {
  let component: ComercioContactdataPanelComponent;
  let fixture: ComponentFixture<ComercioContactdataPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComercioContactdataPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercioContactdataPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
