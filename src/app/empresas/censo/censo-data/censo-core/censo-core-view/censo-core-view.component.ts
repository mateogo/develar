import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CensoIndustriasController } from '../../../../censo.controller';
import { CensoIndustriasService } from '../../../../censo-service';
import { NotificationService } from '../../../../../develar-commons/notifications.service';

import { 	CensoIndustrias, 
					EstadoCenso, 
					Empresa, 
					CensoActividad,
					CensoData } from '../../../../censo.model';

import { devutils }from '../../../../../develar-commons/utils'

const ACTIVIDAD = 'actividad';
const CANCEL = 'cancel';
const UPDATE = 'update';
const PAGE_ABSOLUTE =   '/mab/empresas/inicio';
const CENSO_ABSOLUTE =  '/mab/empresas/gestion/censo2021';
const CENSO_ACTIVIDAD =      '/mab/empresas/gestion/censo2021/actividad/:id';
const ACTUAL_CENSO = "censo:empresarial:2021:01";
const CONFIRMATION_MODAL_CONFIG = {
	data: {
	  caption: 'CIERRE DEL CENSO EMPRESARIAL 2021',
	  body: 'Al confirmar el CIERRE estarás dando por completada y validada la información cargada. Una vez pasada la revisión se te informará la CONFIRMACIÓN de cumplimiento.',
	  accept: {
		action: 'accept',
		label: 'Aceptar'
	  },
	  cancel: {
		action: 'canel',
		label: 'Cancelar'
	  }
	}
  };
  

@Component({
  selector: 'censo-core-view',
  templateUrl: './censo-core-view.component.html',
  styleUrls: ['./censo-core-view.component.scss']
})
export class CensoCoreViewComponent implements OnInit {
	@Input() token: CensoIndustrias;

/**
 	<div class="row">
 		<div class="col-sm-12 col-md-12">
 			<p class='text-destacado'>{{ compNum }} </p>
 			<p class='text-normal'>{{ estado }}</p>
 			<p class='text-normal'>{{ codigo }} </p>

 			<p class='text-normal'>
 				<strong>{{ slug }}</strong>
 		</div>


**/

  public compNum = "";
  public estado = "";
  public codigo = "";
  public slug = "";
  public isClosable = false;
  public closable$:BehaviorSubject<boolean>  = new BehaviorSubject<boolean>(false);

  constructor(
	private _notificationService: NotificationService,
	private censoCtrl: CensoIndustriasController,


  ) { }

  ngOnInit() {
  	let _estado = CensoIndustriasService.getOptionLabel('estado', this.token.estado.estado);
  	let _navance = CensoIndustriasService.getOptionLabel('navance', this.token.estado.navance);

    this.slug = this.token.censo.slug;
    this.compNum = this.token.compName + '/' + this.token.compNum;
    this.codigo = "Estado: " + _estado + '::' + 'Avance: ' + _navance;

	this.closable$ = CensoIndustriasService.closable$;

	CensoIndustriasService.emitIfClosable(this.token);

  }

  closeCenso(){
	  console.log('todo');
	  const whichModal = CONFIRMATION_MODAL_CONFIG;

	  this._notificationService.openModalDialog(whichModal).subscribe(result => {
		  console.log('result [%s]', result);
		  if(result === "accept"){
			  this.censoCtrl.closeCenso(this.token).subscribe(censo => {
				  if(censo){
					  this.censoCtrl.openSnackBar('Actualización exitosa', 'CERRAR');
				  }
			  })
		  }
	  })
  }


}

