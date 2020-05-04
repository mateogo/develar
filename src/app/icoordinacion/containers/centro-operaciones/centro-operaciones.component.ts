import { Component, OnInit} from "@angular/core";
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { SolicitudesInternacionModalComponent } from '../../components/solicitudes-internacion-modal/solicitudes-internacion-modal.component';
import { TransitoModalComponent } from '../../components/transito-modal/transito-modal.component';

import { CentroOperacionesFacade } from '../../centro-operaciones.facade';

import { BotonContador } from '../../../develar-commons/base.model';

import { locaciones as Locaciones} from '../../../models/camas';

//import { LocacionFacade } from '../../locacion.facade';
import { BOTONES_BUFFERS } from './botones-buffers';
import { CamaEstadoModalComponent } from '../../../ilocacion/components/camas-mosaicos-component/cama-estado-modal/cama-estado-modal.component';
import { BufferModalComponent } from '../../../ilocacion/components/buffer-modal/buffer-modal.component';

import {     SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, LocacionAvailable,
                    Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
                    MasterAllocation, AsignarRecursoEvent } from '../../../salud/internacion/internacion.model';

import { LocacionHospitalaria, Servicio} from '../../../entities/locaciones/locacion.model';

import { InternacionHelper }  from '../../../salud/internacion/internacion.helper';
import { InternacionService } from '../../../salud/internacion/internacion.service';

const CAMA_LIBRE = 'libre';
const CAMA_OCUPADA = 'ocupada';
const ASIGNAR = 'asignar';


const SERVICIOS = [
  {
    id: 'uti',
    nombre: 'Terapia intensiva',
    solicitudes$: undefined
  },
  {
    id: 'ute',
    nombre: 'Terapia intermedia',
    solicitudes$: undefined
  },
  {
    id: 'is',
    nombre: 'Internación simple',
    solicitudes$: undefined
  },
  {
    id: 'ais',
    nombre: 'Aislamiento',
    solicitudes$: undefined
  },
  {
    id: 'gua',
    nombre: 'Guardia',
    solicitudes$: undefined
  },
  {
    id: 'ped',
    nombre: 'Pediatría',
    solicitudes$: undefined
  },
];

@Component({
  selector: 'centro-operaciones',
  templateUrl: './centro-operaciones.component.html',
  styleUrls: ['./centro-operaciones.component.scss']
})
export class CentroOperacionesComponent implements OnInit {
  //Locaciones

  public masterList: MasterAllocation[] = [];
  public pool: MasterAllocation;

  public serviciosOptList =   InternacionHelper.getOptionlist('servicios');
  public capacidadesOptList = InternacionHelper.getOptionlist('capacidades');
  public periferiaOptList =   InternacionHelper.getOptionlist('estadosPeriferia');

  public botonesPool: Array<any> = [];

  public locacionId: string = "";
  public locacion$: Observable<LocacionHospitalaria>
  private _currentLocation: LocacionHospitalaria;

  public serviciosOfrecidos: Servicio[] = [];

  public internaciones: SolicitudInternacion[] = [];

  public admision$:    Observable<SolicitudInternacion[]>;
  public traslado$:    Observable<SolicitudInternacion[]>;
  public salida$:      Observable<SolicitudInternacion[]>;
  public externacion$: Observable<SolicitudInternacion[]>;
  public transito$:    Observable<SolicitudInternacion[]>;

  public master_internacion: any;
  public master_periferia: any;
  public master_camas: any;

  public locacionName: string;
  public locacionCode: string;
  public capacidadToPrint: string;


  //template Helpers
  public showData = false;
  public title = 'ESTADO DE OCUPACIÓN DE LAS LOCACIONES DE INTERNACIÓN'
  public capacidadTitle = 'Capacidad nominal: '

  public botonesPeriferia: BotonContador[] = BOTONES_BUFFERS;
  public showEstadoOcupacion = true;
  public showEstadoDisponibilidad = true;
  public data$: Subject<any> = new BehaviorSubject('Helouuuu');


  //ToBeDeprecated
  currentLocation : any = new Object(); //modifacarlo por su tipo (se uso para el object.assign)
  loadedLocationFronDB : any = new Object(); //modificarlo por su tipo
  totalCamas: number;
  msjSegunRadioButton : string = '';

///////////////
  solicitudesInternacion$: Observable<any[]>;
  locaciones$: Observable<any[]>;
  botonesServicios$: Observable<BotonContador[]>;

  capacidadEfectiva$: Observable<any>;
  capacidadReal$: Observable<any>;
  
  servicios;


  constructor(
      private _isrv: InternacionService,
      private _facade: CentroOperacionesFacade,
      private router: Router,
      private route: ActivatedRoute,
      public dialog: MatDialog,
      ){
      this.solicitudesInternacion$ = this._facade.loadSolicitudesInternacion$();
      this.locaciones$             = this._facade.loadLocaciones$();
      this.botonesServicios$       = this._facade.loadBotonesServicios$();
  }


  ngOnInit(){
    this.servicios = SERVICIOS;

    this.servicios.forEach(s => {
      s.solicitudes$ = this.solicitudesInternacion$;
    });
    this.locacionId = this.route.snapshot.paramMap.get('id');
    this._isrv.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
    /****/

    // if(!this.locacionId){
    //     this._isrv.openSnackBar('Debe tener seleccionado una locación', 'CERRAR')
    //     this.router.navigate(['/salud/gestion/recepcion']);
    //     return;
    // }

    this.initOnce()
    this.refreshView();
  
  }

  refreshView(){
    this.showData = false;
    this.loadMasterAllocation()

  }
  
  navigateTo(e, locacion){
    e.preventDefault();
    e.stopPropagation();
    this.router.navigate(['/salud/internacion/locacion/', locacion.id]);

  }


    /**************************************************************************/
    /******* Gestión de los radio button que filtran Ocupado / Disponible ****/
    /************************************************************************/
    radioSelectedOptionEvent(e){
        switch(e.value){
            case 0 : { this.showAllCamas(); break;};
            case 1 : { this.showDisponiblesOrNotDisponible(CAMA_OCUPADA); break;};
            case 2: { this.showDisponiblesOrNotDisponible(CAMA_LIBRE); break;}
        }
    }

    private showAllCamas(){
        this.showEstadoOcupacion = true;
        this.showEstadoDisponibilidad = true;

        // /** Este sería el caso del VER TODO, por lo cual hay que traer las locaciones originales */
        // this.currentLocation.estado_ocupacion = this.loadedLocationFronDB.estado_ocupacion;
        // this.msjSegunRadioButton = this.calcularCamasDisponibles('todo');
    }

    private showDisponiblesOrNotDisponible(selected : string){
        if(selected === CAMA_LIBRE){
            this.showEstadoOcupacion = false;
            this.showEstadoDisponibilidad = true;

        }else if(selected === CAMA_OCUPADA){
            this.showEstadoOcupacion = true;
            this.showEstadoDisponibilidad = false;

        }



        /** Vamos a filtrar segun el parametro recibido */

        // let filtrado = [];
        // this.loadedLocationFronDB.estado_ocupacion.forEach( cama => {
        //     if( cama.estado === estado_ocupacion){
        //         filtrado.push(cama);
        //     }
        // })
        // this.currentLocation.estado_ocupacion = filtrado;
        // if(estado_ocupacion === 'LIBRE'){
        //     this.msjSegunRadioButton = 'Disponibles '+filtrado.length;
        // }else if(estado_ocupacion === 'ocupada'){
        //     this.msjSegunRadioButton = 'Ocupadas '+filtrado.length;
        // }
    }




  selectPoolMembers(target){
    this._isrv.fetchInternacionesInPool(target).subscribe(solList => {
      if(solList && solList.length){
        this.buildPoolMembersData(target, solList);
      }else {
        // todo
      }


    })

  }

  private buildPoolMembersData(target: string, list: SolicitudInternacion[]){
    let locaciones = this.filterLocacionesWithAvailability(target, this.masterList);
    this.data$.next(locaciones)
    this.openPooldeInternacionModal(target, locaciones, list)

  }

  private openPooldeInternacionModal(target: string, locaciones: LocacionAvailable[], solicitudes:SolicitudInternacion[] ){

        const dialogRef = this.dialog.open(
          SolicitudesInternacionModalComponent,
          {
            width: '80%',
            data: {
              target: target,
              locaciones: locaciones,
              solicitudes: solicitudes
            }
          }
        );
  
        dialogRef.afterClosed().subscribe(result => {
          if(result){
            let targetLocation = locaciones.find(l => l.code === result.locacion);
            if(targetLocation && result.solicitudes && result.solicitudes.length){
              this.processPoolToLocacion(target, targetLocation, result.solicitudes);

            }else {
              // TODO
            }
          }
        });
  }

  private processPoolToLocacion(target: string, location: LocacionAvailable, solicitudes: SolicitudInternacion[]){
    let isValid = this.validatePoolConditions(location, solicitudes);
    let promiseArray = []
 
    if(isValid){
      solicitudes.forEach(solicitud =>{
        this.processSolicitudTransition(target, location, solicitud, promiseArray);
      })
    }else {
      //TODO
    }

    Promise.all(promiseArray).then(values => {
       this.refreshView();
    })

  }
  //ACA

  private processSolicitudTransition(target: string, location: LocacionAvailable, solicitud: SolicitudInternacion, promiseArray: Array<any>){
    let promise = new Promise((resolve, reject) => {
        this._isrv.asignarLocacion(solicitud, location).subscribe(solUpdated => {
          if(solUpdated){
            //c onsole.log('solTransitioned!""')
          }else{
            //c onsole.log('ooopsss... algo anduvo mal');
          }
          resolve(true);
        })

    });

    promiseArray.push(promise)
  }

  private validatePoolConditions(location: LocacionAvailable, solicitudes: SolicitudInternacion[]): boolean{
    let ok = true;


    return ok
  }



  private filterLocacionesWithAvailability(target: string, masterlist: MasterAllocation[]): LocacionAvailable[]{
    function availableFor(target, master: MasterAllocation): boolean {
      let ok = true;
      let disponible = master && master.disponible && master.disponible[target];
      if(disponible && disponible.capacidad>disponible.ocupado) return ok
      return false;
    }

    function buildToken(target, master: MasterAllocation):LocacionAvailable{
      let loc = new LocacionAvailable()

      loc.target = target ;
      loc.servicio = '' ;
      loc.id = master.id ;
      loc.code = master.code ;
      loc.slug = master.slug ;
      loc.capacidad = master.disponible[target].capacidad ;
      loc.ocupado = master.disponible[target].ocupado ;
      return loc;
    }

    let list = masterlist.filter(t => availableFor(target, t)).map(t => buildToken(target, t));
    return list;
  }

  onBotoneraClick(botonId){
    //TODO: abrir modal con los datos que se corresponden al botonId
    this.solicitudesInternacion$.subscribe(solicitudesInternacion => {
      this.botonesServicios$.subscribe(botones => {
        const dialogRef = this.dialog.open(
          SolicitudesInternacionModalComponent,
          {
            width: '80%',
            data: {
              titulo: botones.find(b => b.val === botonId).label,
              solicitudes: solicitudesInternacion.map(sol => sol.requeridox) //find usando el botonId
            }
          }
        );
  
        dialogRef.afterClosed().subscribe(seleccionadas => {
          //TODO: luego de seleccionar solicitudes de internación...
        });
      });
    });
  }

  onTransitoClick(locacion){
    this.solicitudesInternacion$.subscribe(solicitudesInternacion => {
      const dialogRef = this.dialog.open(
        TransitoModalComponent,
        {
          width: '450px',
          data: {
            pacientes: solicitudesInternacion.map(s => s.requeridox),
            nombreCentroSalud: locacion.name
          }
        }
      );
    
      dialogRef.afterClosed().subscribe(
        res => {
        //TODO: derivar los pacientes
        }
      );
    });

  }
  ///////////////////

  private initOnce(){
    this.data$.next('Hellouuuu!')

      // this.locacion$ = this._isrv.locacion$;
      // this._isrv.fetchLocacionById(id).then(locacion=>{
      //     if(locacion){
      //         this._currentLocation = locacion;
      //         this._isrv.locacion = locacion;
      //         this.initLocationFacilities(locacion);
      //     }else {
      //         this._isrv.openSnackBar('Locación NO ENCONTRADA', 'CERRAR')
      //         this.router.navigate(['/salud/gestion/recepcion']);
      //         return;
      //     }            
      // })
  }

  private loadMasterAllocation(){
    this.masterList = [];

    this._isrv.fetchCapacidadDisponible().subscribe(alocationList =>{
      if(alocationList && alocationList.length){

        this.showMasterAllocator(alocationList)

      }else {
        //TODO
      }

    });
  }
  private showMasterAllocator(list: MasterAllocation[]){
    let pool = list.find(t => t.code === 'pool');
    if(pool){
      this.pool = pool;
      this.botonesPool = this._isrv.getBotonesPool(this.pool);
      this.data$.next(list);

    }else{
      this.pool = null;
    }

    this.masterList = list.filter(t => t.code !== 'pool');

    this.showData = true;

  }


  private initLocationFacilities(locacion: LocacionHospitalaria){
      this.serviciosOfrecidos = this._isrv.buildServiciosList(locacion);
      this.locacionCode = locacion.code
      this.locacionName = locacion.slug
      this.capacidadToPrint = InternacionHelper.capacidadDisponibleToPrint(this.serviciosOfrecidos)



      this.refreshAfectadosList(locacion);
  }

  private refreshAfectadosList(locacion: LocacionHospitalaria){
      this._isrv.fetchInternacionesByLocationId(locacion._id).subscribe(internaciones =>{
          if(internaciones && internaciones.length){
              this.initAfectadosList(internaciones);
          }else {
              this.initAfectadosList([]);
          }

      })

  }

  private initAfectadosList(internaciones: SolicitudInternacion[]){
      this.internaciones = internaciones;
      this._isrv.internaciones = this.internaciones;

      this.master_internacion = this._isrv.buildEstadoInternacion(this.internaciones);
      this.master_periferia =   this._isrv.buildEstadoPeriferia(this.internaciones);
      this.botonesPeriferia =   this._isrv.getBotonesPeriferia(this.master_periferia);
      this.master_camas =       this._isrv.buildEstadoCamas(this._currentLocation, this.internaciones)

      this.initLocacionData();

  }

  private initLocacionData(){
      /****/
      Object.assign(this.loadedLocationFronDB,Locaciones[0]);
      Object.assign(this.currentLocation,this.loadedLocationFronDB); //me guardo un atributo para el filtrado

      this.loadedLocationFronDB.estado_ocupacion = this.currentLocation.estado_ocupacion;


      //this.totalCamas = this.loadedLocationFronDB.camas.uti + this.loadedLocationFronDB.camas.ti + this.loadedLocationFronDB.camas.conext + this.loadedLocationFronDB.camas.internacion;
      this.msjSegunRadioButton = this.calcularCamasDisponibles('todo');

      //and... it's... showTime!!!
      this.showData = true;
  }



  private calcularCamasDisponibles(seleccion : string) : string{
      switch(seleccion){
          case 'todo' : {
              let disponibles : number = 0;
              this.loadedLocationFronDB.estado_ocupacion.forEach(cama => {
                  if(cama.estado === 'LIBRE'){
                      disponibles++;
                  }
              }
              )
          return 'Disponibles '+disponibles+' de '+this.loadedLocationFronDB.estado_ocupacion.length;
          }
      }


  }

  /************************************************************************/
  currentProyeccionDateEmit(fecha : Date){
      
      let fechaProyeccion = new Date();
      fechaProyeccion.setDate(fecha.getDate());
      fechaProyeccion.setHours(0,0,0,0);
      this.currentLocation.estado_ocupacion.forEach( cama => {
          if(cama.estado !== 'LIBRE'){
              let date = parseInt(cama.fecha_prev_out.substring(0,2));
              let month = parseInt(cama.fecha_prev_out.substring(3,5));
              let year = parseInt(cama.fecha_prev_out.substring(6));

              let fecha_prev_out = new Date(year, (month-1), date);
              fecha_prev_out.setHours(0,0,0,0);
              if((fechaProyeccion > fecha_prev_out) || (fechaProyeccion.getTime() === fecha_prev_out.getTime())){
                  cama.estado = 'Pronto a desocuparse'
              }else if(cama.estado == 'Pronto a desocuparse'){
                      cama.estado = 'ocupada';   
              }
          }
      })
      
  }

  checkBoxEmit(e){
      let filtrado = [];
      e.length === 0 ? Object.assign(this.currentLocation,this.loadedLocationFronDB) : null;
      if(e.length === 1){
          let checked = e[0];
          switch(checked.value){
              case 0 :{filtrado = this.showCamasService('uti'); break; }
              case 1 :{filtrado = this.showCamasService('ti'); break; }
              // case 2 :{ filtrado = this.showCamasService(''); break };
          }
      }else if( e.length > 1){
          e.forEach(cama => {
              switch(cama.value){
                  case 0 :{
                      filtrado = this.showCamasService('uti',filtrado);
                      this.currentLocation.estado_ocupacion = filtrado;
                      break; }
                  case 1 :{
                      filtrado = this.showCamasService('ti',filtrado);
                      this.currentLocation.estado_ocupacion = filtrado;
                      break; }
                  // case 2 :{ filtrado = this.showCamasService(''); break };
              }
          })
      }
      


      
  }

  showCamasService(tipo : string, filtro? : any){
      
      if(filtro !== undefined){
          this.loadedLocationFronDB.estado_ocupacion.forEach(cama => {
              if(cama.tipo === tipo){
                  filtro.push(cama);
              }
          })
          return filtro;
      }else{
      let filtrado = [];
      this.loadedLocationFronDB.estado_ocupacion.forEach(cama => {
          if(cama.tipo === tipo){
              filtrado.push(cama);
          }
      })
      this.currentLocation.estado_ocupacion = filtrado;
      return filtrado;
      }
      
  }

  openPacienteModal(pacienteId){
      const dialogRef = this.dialog.open(
          CamaEstadoModalComponent,
          {
              width: '750px',
              data: {
                  cama: this.currentLocation.estado_ocupacion[0]
              }
          }
      );

      dialogRef.afterClosed().subscribe(result => {
          //TODO: hacer lo que corresponda
      });
  }


  /**************************************************************************/
  /******* Gestión pacientes en botones periferia                       ****/
  /************************************************************************/
  onAfectadosPeriferiaEvent(periferia){
      let pacientes = this.master_periferia[periferia]
      const dialogRef = this.dialog.open(
          BufferModalComponent,
          {
              width: '80%',
              data: {
                  pacientes: pacientes
              }
          }
      )
      dialogRef.afterClosed().subscribe(result => {
        if(result){
          // c onsole.log('result: [%s]  [%s]', result.locacion, result.solicituds.length)
          //TODO
        }
      });
  }

  /******************************************************************************/
  /******* Gestión asignacion recurso->paciente en modal RecursosComponent  ****/
  /****************************************************************************/

  asignarRecursos(event: AsignarRecursoEvent){
      if(!event) return;
      if(event.action === ASIGNAR){
          this.asignarPacienteARecurso(event);
      }

  }

  private asignarPacienteARecurso(event: AsignarRecursoEvent){
      this._isrv.asignarRecurso(event.sinternacion, this._currentLocation, event.servicio, event.recurso).subscribe(sol => {
          this.refreshAfectadosList(this._currentLocation);
      })

  }


  
}
