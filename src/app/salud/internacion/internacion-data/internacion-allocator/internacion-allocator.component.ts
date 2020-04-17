import { Component, OnInit,Output, Input, EventEmitter} from '@angular/core';
//import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

//import { Person, PersonContactData, Address, UpdatePersonEvent } from '../../../../entities/person/person';

//import { PersonService } from '../../../person.service';

import { LocacionHospitalaria, LocacionEvent} from '../../../../entities/locaciones/locacion.model';

import { 	SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, MotivoInternacion,
					Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
					UpdateInternacionEvent, MasterAllocation, MasterSelectedEvent } from '../../internacion.model';

import { InternacionHelper }  from '../../internacion.helper';

import { InternacionService } from '../../internacion.service';

const CANCEL = 'cancel';
const UPDATE = 'update';
const CREATE = 'create';
const CORE = 'core';
const SERVICIO_DEFAULT = "INTERNACION"
const SELECTED = 'selected';


@Component({
  selector: 'internacion-allocator',
  templateUrl: './internacion-allocator.component.html',
  styleUrls: ['./internacion-allocator.component.scss']
})
export class InternacionAllocatorComponent implements OnInit {
	@Input() query: any = {};
  @Output() updateAllocatorEvent = new EventEmitter<MasterSelectedEvent>();

  public  masterList: MasterAllocation[] = [];
  private masterData: MasterAllocation[] = [];

  public hasMasterList = false;
  public showMasterAllocatorView = false;

  public showServicios = false;

  public capacidades = InternacionHelper.getOptionlist('capacidades')

  pageTitle: string = 'Master allocator';

  constructor(
  		private intSrv: InternacionService,
  	) { }

  ngOnInit() {

  	this.fetchRecursosDisponibles(this.query)
  }

  locationSelected(e, master: MasterAllocation, capacidad:string){
    this.emitEvent(SELECTED, master);
  }

  private emitEvent(action, master: MasterAllocation){
    this.updateAllocatorEvent.emit({
      action:action,
      type: 'MASTER',
      token: master

    })
  }

	private fetchRecursosDisponibles(query: any){
		this.intSrv.fetchCapacidadDisponible(query).subscribe(alocationList =>{
			if(alocationList && alocationList.length){

				this.masterData = alocationList;
        this.masterList = InternacionHelper.filterMasterAllocationList(this.query, this.masterData);
        this.hasMasterList = true;
        this.showMasterAllocatorView = true;
			}
		});

	}

  private getFilteredData(query): MasterAllocation[]{
    let target_capacity = query.capacidad;

    let target = this.masterData.filter(token =>{
      let disponible = token.disponible;
      let buscado = disponible[target_capacity];
      if(buscado){
        if(buscado.capacidad >= buscado.ocupado) return true;
      }
      return false;
    });

    return target;
  }




}


