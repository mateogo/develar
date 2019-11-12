import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitaPedidosViewComponent } from './solicita-pedidos-view.component';

describe('SolicitaPedidosViewComponent', () => {
  let component: SolicitaPedidosViewComponent;
  let fixture: ComponentFixture<SolicitaPedidosViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitaPedidosViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitaPedidosViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
