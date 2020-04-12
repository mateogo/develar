import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Person, PersonContactData, Address, UpdatePersonEvent } from '../../../../entities/person/person';

import { PersonService } from '../../../person.service';

import { LocacionHospitalaria, LocacionEvent} from '../../../../entities/locaciones/locacion.model';

import { 	SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, 
					Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
					MasterAllocation } from '../../internacion.model';

import { InternacionHelper }  from '../../internacion.helper';
import { InternacionService } from '../../internacion.service';

@Component({
  selector: 'app-test-uno',
  templateUrl: './test-uno.component.html',
  styleUrls: ['./test-uno.component.scss']
})
export class TestUnoComponent implements OnInit {
	public tdoc = "DNI";
	public ndoc = "22111353";
	public servicio = "UTI";

	public masterList: MasterAllocation[] = [];

	public showMasterAllocatorView = false;
	public testData;
	public form: FormGroup;
	public hospitalesList$: Observable<LocacionHospitalaria[]>;
  constructor(
  		private perSrv: PersonService,
  		private intSrv: InternacionService,
  		private fb: FormBuilder,
  	) { }

  ngOnInit() {
  	this.testData = new TestData();
  	this.form = this.buildForm(this.testData);
  	this.hospitalesList$ = this.intSrv.fetchLocacionesHospitalarias({});
  	this.hospitalesList$.subscribe(hospitales => {
  		console.log('Hospitales Fetched: [%s]', hospitales);
  	})
  	//this.createSolIntervencion()
  	//this.fetchRecursosDisponibles()
  }


  verDisponible(){
  	this.fetchMasterAllocator({});
  }

  createAsitenciaPool(){
  	this.createSolIntervencion(this.testData.tdoc, this.testData.ndoc, this.testData.servicio)
  }

  fetchRecursos(){
  	this.fetchRecursosDisponiblesAndAllocate()
  }

  alocInServicio(){
  	this.allocateInServiceFromTransito(this.testData.tdoc, this.testData.ndoc);

  }

  createPersonAndSolicitud(){
  	this.createPersonAndSolIntervencion(this.testData.tdoc, this.testData.ndoc, this.testData.servicio)

  }

  onSubmit(){
  	this.collectDataFromForm(this.form, this.testData);
  	console.dir(this.testData);
  }




  /******************************************/
  /**** CREACIÓN DE S/INTERVENCIÓN *********/
	/****************************************/

  private createPersonAndSolIntervencion(tdoc: string, ndoc:string, servicio:string){
  	this.perSrv.fetchPersonByDNI(tdoc, ndoc).subscribe(person => {
  		if(person){
  			console.log('person fetched: [%s]', person.displayName);
  			this.perSrv.updateCurrentPerson(person);
  			this.initNewIntervencion(person, servicio)


  		}else {

  		}
  	})
  }

  private createPersonAndNext(spec: any){
  	
  }


  private createSolIntervencion(tdoc: string, ndoc:string, servicio:string){
  	this.perSrv.fetchPersonByDNI(tdoc, ndoc).subscribe(person => {
  		if(person){
  			console.log('person fetched: [%s]', person.displayName);
  			this.perSrv.updateCurrentPerson(person);
  			this.initNewIntervencion(person, servicio)


  		}else {

  		}
  	})
  }

  private initNewIntervencion(person: Person, servicio: string){
  	let spec = new InternacionSpec();
  	
  	spec.servicio = servicio|| spec.servicio;

  	this.intSrv.createNewSolicitudInternacion(spec, person).subscribe(sol => {
  		if(sol){
  			console.log('Sol Created: [%s]', sol.compNum);
  		}else {
  			console.log('fallo la creación de solicitud')
  		}
  	})

  }


  /************************************************/
  /**** SHOW MASTER ALLOCATOR            *********/
	/**********************************************/
	private fetchMasterAllocator(query){
		this.showMasterAllocatorView = false;

		this.intSrv.fetchCapacidadDisponible().subscribe(alocationList =>{
			this.showMasterAllocator(alocationList)

		});


	}

  /************************************************************/
  /**** BUSCAR LUGAR DISPONIBLE Y ALOCAR EN TRANSITO *********/
	/**********************************************************/

	private fetchRecursosDisponiblesAndAllocate(){
		this.intSrv.fetchCapacidadDisponible().subscribe(alocationList =>{
			let hosp = alocationList[0];
			console.log('Hospital Selected [%s] [%s]', hosp.code, hosp.id);
			this.fetchPersonAndAlocateHosp(this.testData.tdoc, this.testData.ndoc, hosp);
		});

	}

	private fetchPersonAndAlocateHosp(tdoc, ndoc, hosp: MasterAllocation){
		this.perSrv.fetchPersonByDNI(tdoc, ndoc).subscribe(person => {
			console.log('PersonFetched: [%s]', person.displayName);
			this.fetchInternacion(person, hosp);
		})
	}

	private fetchInternacion(person: Person, hosp: MasterAllocation){
		this.intSrv.fetchInternacionesByPersonId(person._id).subscribe(list => {
			if(list && list.length){
				let asistencia = list[0];
				console.log('asistencia RETRIEVE [%s]', asistencia.compNum);
				this.intSrv.allocateInTransit(asistencia, hosp.id, this.testData.servicio ).subscribe(sol =>{
					console.dir(sol)
				})
			}
		})
	}


	/************************************************************/
  /**** Ubicar dentro del Servicio  *********/
	/**********************************************************/
	private allocateInServiceFromTransito(tdoc, ndoc){
		this.perSrv.fetchPersonByDNI(tdoc, ndoc).subscribe(person => {
			console.log('PersonFetched: [%s]', person.displayName);

			this.intSrv.fetchInternacionesByPersonId(person._id).subscribe(list => {
				if(list && list.length){
					let asistencia = list[0];
					console.log('asistencia RETRIEVE [%s]', asistencia.compNum);

					let spec = {
						hab:      this.testData.hab,
						camaCode: this.testData.camaCode,
						camaSlug: this.testData.camaSlug,
						sector:   this.testData.sector,
						piso:     this.testData.piso,
					}
					if(asistencia && asistencia.internacion && asistencia.internacion.locId){

						this.intSrv.allocateInServicio(asistencia, this.testData.servicio, spec ).subscribe(sol =>{
							console.dir(sol)
						})

					}else {
						console.log('NOOOO***********')
					}

				}
			})
		})
	}

	

  /************************************************/
  /****TEMPLATE HELPERS *********/
	/**********************************************/
	showMasterAllocator(list: MasterAllocation[]){

		this.masterList = list;
		this.showMasterAllocatorView = true;
	}

	changeHospitalValue(type, hospital){
		console.log('hospital:[%s] [%s] [%s]',type, hospital.code, hospital._id)
		this.testData.currentHospital = hospital;
	}


  private buildForm(data: TestData): FormGroup{
  	let form: FormGroup;

    form = this.fb.group(data)

		return form;
	}

	private collectDataFromForm(form: FormGroup, data:TestData){
		data = Object.assign(data, this.form.value)
	}

}


class TestData {
	nombre: string = 'Alberto';
	apellido: string = 'Fernandez';
	tdoc: string = 'DNI';
	ndoc: string = '22111353'
	telefono: string = '11 2222 3434';
	currentHospital: LocacionHospitalaria;


	hospCode: string = 'HLM';

	servicio: string = 'UTI';
	piso: string = 'P-1';
	sector: string = 'Sector COVID';
	hab: string = 'Hab 101';
	camaCode: string = '01';
	camaSlug: string = '101-01';
	estado: string = 'pool';
	constructor(){
		this.currentHospital = new LocacionHospitalaria();
	}

}
