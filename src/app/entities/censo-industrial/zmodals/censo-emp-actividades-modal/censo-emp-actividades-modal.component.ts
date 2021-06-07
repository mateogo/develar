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
import { CensoEmpresarialHelper, ActividadEmpresa } from '../../censo-empresarial-helper';

import { CensoIndustrialService } from '../../censo-industrial.service';
import { devutils } from '../../../../develar-commons/utils';

const CERRAR = 'cerrar';

@Component({
  selector: 'censo-emp-actividades-modal',
  templateUrl: './censo-emp-actividades-modal.component.html',
  styleUrls: ['./censo-emp-actividades-modal.component.scss']
})
export class CensoEmpActividadesModalComponent implements OnInit {

  // template helpers
  public displayAs = '';
  private result: UpdateCensoEvent;
  public actividades: ActividadEmpresa[] = [];



  constructor(
        private censoService: CensoIndustrialService,
        public dialogRef: MatDialogRef<CensoEmpActividadesModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

  ngOnInit(): void {
    this.actividades = this.data.actividades;

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
