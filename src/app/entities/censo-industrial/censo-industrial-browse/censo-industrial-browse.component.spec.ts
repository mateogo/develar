import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CensoIndustrialBrowseComponent } from './censo-industrial-browse.component';

describe('CensoIndustrialBrowseComponent', () => {
  let component: CensoIndustrialBrowseComponent;
  let fixture: ComponentFixture<CensoIndustrialBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CensoIndustrialBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CensoIndustrialBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
