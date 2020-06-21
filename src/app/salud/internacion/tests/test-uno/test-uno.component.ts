import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Observable, interval, Subject } from 'rxjs';
import { startWith, switchMap, take, tap } from 'rxjs/operators'

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
  styleUrls: ['./test-uno.component.scss'],
})
export class TestUnoComponent implements OnInit {
	public tdoc = "DNI";
	public ndoc = "22111353";
	public servicio = "UTI";

	public masterList: MasterAllocation[] = [];

	public showMasterAllocatorView = false;
	public showTests = false;
	public testData;
	public form: FormGroup;
	public hospitalesList$: Observable<LocacionHospitalaria[]>;
  constructor(
  		private perSrv: PersonService,
  		private intSrv: InternacionService,
  		private fb: FormBuilder,
			private router: Router,
			private http: HttpClient,
			private _zone: NgZone
  	) { }

  ngOnInit() {
  	this.testData = new TestData();
  	this.form = this.buildForm(this.testData);
  	this.hospitalesList$ = this.intSrv.fetchLocacionesHospitalarias({});
  	this.hospitalesList$.subscribe(hospitales => {
  	})



  }

  testAPI(){
  	//this.pruebaWithGet();
  }

  private pruebaWithGet(){
  	console.log('pruebaWithGet to BEGIN!!! ')
  	let observable = this.fetchUsersWithGet();

  	console.log('Ready to subscribe')
  	observable.subscribe(data =>  {
      	console.log('Observable SUSB')
      	console.log(data);
        //observer.next(event);
  	})
  }
	
	private fetchUsersWithGet():Observable<any>{
  	let userUrl ="/api/auditodatos/getusers";
    let url = `${userUrl}`;
	  let headers = new HttpHeaders().set('Content-Type', 'application/json');

  	let getObs = this.http.get<any>(url, {
  		headers: headers,
  		observe: 'body',

  	}).pipe(
  		tap(
  				data => this.log(data),
  				error => this.logError(error)
  			)
  	);
  	console.log('GetUsers to RETURN')
  	return getObs;
  }

  private log(data: any){
  	console.log('Tapped LOG')
  	console.log(data);
  }

  private logError(error: any){
  	console.log(error);
  }


  private prueba(){
  	console.log('PRueba to BEGIN')
  	let observable = this.fetchUsers();
  	observable.subscribe(data =>  {
  		console.log('Subscribed!')
  		console.log(data);
  	})
  }
	
	private pruebaWithSwitch(){
  	console.log('pruebaWithSwitch to BEGIN!!! ')
  	let api = this.fetchUsersWithGet();

  	let user$: Observable<any>;

  	console.log('Ready to subscribe')
  	user$ = interval(1000).pipe(
  						take(4),
  						startWith(0),

	  					switchMap( ()=> {
	  						return api;
	  					})
  					)

  	user$.subscribe(x =>{
  		console.log('subscribed!!!')
  		console.dir(x);
  	})
  }



  private fetchUsers(): Observable<any>{
  	let userUrl ="/api/auditodatos/getusers";


    let url = `${userUrl}`;

    return Observable.create(observer => {
        console.log('Observable Create')
        let eventSource = new EventSource(url);
        eventSource.onmessage = event => {
          this._zone.run(()=> {
          	console.log('event')
            observer.next(event);        	
          })

        }

        eventSource.onerror = error => {
        	console.log('error')
        	console.dir(error)
            observer.error(error);
        }
 
    })


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
  }

  navigateTo(e, id: string ){
  	e.stopPropagation();
  	e.preventDefault();

      this.router.navigate(['/salud/internacion/locacion/', id]);
  }




  /******************************************/
  /**** CREACIÓN DE S/INTERVENCIÓN *********/
	/****************************************/

  private createPersonAndSolIntervencion(tdoc: string, ndoc:string, servicio:string){
  	this.perSrv.fetchPersonByDNI(tdoc, ndoc).subscribe(person => {
  		if(person){
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
  			//console.log('Sol Created: [%s]', sol.compNum);
  		}else {
  			//console.log('fallo la creación de solicitud')
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
			this.fetchPersonAndAlocateHosp(this.testData.tdoc, this.testData.ndoc, hosp);
		});

	}

	private fetchPersonAndAlocateHosp(tdoc, ndoc, hosp: MasterAllocation){
		this.perSrv.fetchPersonByDNI(tdoc, ndoc).subscribe(person => {
			this.fetchInternacion(person, hosp);
		})
	}

	private fetchInternacion(person: Person, hosp: MasterAllocation){
		this.intSrv.fetchInternacionesByPersonId(person._id).subscribe(list => {
			if(list && list.length){
				let asistencia = list[0];
				this.intSrv.allocateInTransit(asistencia, hosp.id, this.testData.servicio ).subscribe(sol =>{
				})
			}
		})
	}


	/************************************************************/
  /**** Ubicar dentro del Servicio  *********/
	/**********************************************************/
	private allocateInServiceFromTransito(tdoc, ndoc){
		this.perSrv.fetchPersonByDNI(tdoc, ndoc).subscribe(person => {

			this.intSrv.fetchInternacionesByPersonId(person._id).subscribe(list => {
				if(list && list.length){
					let asistencia = list[0];

					let spec = {
						hab:      this.testData.hab,
						camaCode: this.testData.camaCode,
						camaSlug: this.testData.camaSlug,
						sector:   this.testData.sector,
						piso:     this.testData.piso,
					}
					if(asistencia && asistencia.internacion && asistencia.internacion.locId){

						this.intSrv.allocateInServicio(asistencia, this.testData.servicio, spec ).subscribe(sol =>{
						})

					}else {
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
		this.showTests = true;
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

