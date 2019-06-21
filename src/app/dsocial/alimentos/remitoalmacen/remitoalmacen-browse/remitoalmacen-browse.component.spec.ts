import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemitoalmacenBrowseComponent } from './remitoalmacen-browse.component';

describe('RemitoalmacenBrowseComponent', () => {
  let component: RemitoalmacenBrowseComponent;
  let fixture: ComponentFixture<RemitoalmacenBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemitoalmacenBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemitoalmacenBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
