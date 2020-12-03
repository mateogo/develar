import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VinculosBrowseTableComponent } from './vinculos-browse-table.component';

describe('VinculosBrowseTableComponent', () => {
  let component: VinculosBrowseTableComponent;
  let fixture: ComponentFixture<VinculosBrowseTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VinculosBrowseTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VinculosBrowseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
