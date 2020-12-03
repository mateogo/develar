import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VinculosBrowseComponent } from './vinculos-browse.component';

describe('VinculosBrowseComponent', () => {
  let component: VinculosBrowseComponent;
  let fixture: ComponentFixture<VinculosBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VinculosBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VinculosBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
