import { Component, OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';


import {  CensoBienes,
          CensoIndustrias,
          CensoMaquinarias,
          CensoPatentes,
          CensoProductos,
          CensoExpectativas,
          CensoInversion,
          CensoRecursosHumanos,
          CensoFollowUp,
          UpdateCensoEvent,
          CensoComercializacion } from '../../../../empresas/censo.model';

import { CensoIndustriasHelper, TipoEmpresa } from '../../censo-industrial.helper';
import { CensoEmpresarialHelper, TamanioEmpresa } from '../../censo-empresarial-helper';

import { CensoIndustrialService } from '../../censo-industrial.service';
import { devutils } from '../../../../develar-commons/utils';

const CERRAR = 'cerrar';

@Component({
  selector: 'censo-emp-tamanio-modal',
  templateUrl: './censo-emp-tamanio-modal.component.html',
  styleUrls: ['./censo-emp-tamanio-modal.component.scss']
})
export class CensoEmpTamanioModalComponent implements OnInit {
  // template helpers
  public displayAs = '';
  private result: UpdateCensoEvent;
  public tamanios: TamanioEmpresa[] = [];

  constructor(
        private censoService: CensoIndustrialService,
        public dialogRef: MatDialogRef<CensoEmpTamanioModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

  ngOnInit(): void {
    this.tamanios = this.data.tamanios;

    this.initOnce();
  }

  onSubmit(){
    this.result.action = CERRAR;
		this.dialogRef.close();
  }

  onCancel(){
    this.result.action = CERRAR;
		this.dialogRef.close();
  }

  private initOnce(){

  }

}