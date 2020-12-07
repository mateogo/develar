import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VinculosAgregarDialogComponent } from './vinculos-agregar-dialog.component';

describe('VinculosAgregarDialogComponent', () => {
  let component: VinculosAgregarDialogComponent;
  let fixture: ComponentFixture<VinculosAgregarDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VinculosAgregarDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VinculosAgregarDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
