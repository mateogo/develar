import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitaPedidosEditComponent } from './solicita-pedidos-edit.component';

describe('SolicitaPedidosEditComponent', () => {
  let component: SolicitaPedidosEditComponent;
  let fixture: ComponentFixture<SolicitaPedidosEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitaPedidosEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitaPedidosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
