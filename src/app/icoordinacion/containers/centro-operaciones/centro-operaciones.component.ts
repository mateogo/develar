import { Component, OnInit} from "@angular/core";
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { BehaviorSubject } from 'rxjs';

import { SolicitudesInternacionModalComponent } from '../../components/solicitudes-internacion-modal/solicitudes-internacion-modal.component';
import { InternacionAltaComponent } from '../../components/internacion-alta/internacion-alta.component';

import { BotonContador } from '../../../develar-commons/base.model';

//import { LocacionFacade } from '../../locacion.facade';
//import { AltaRapidaPacienteModalComponent } from '../../../develar-commons/alta-rapida-paciente-modal/alta-rapida-paciente-modal.component';

import { InternacionHeaderControlComponent } from '../../../salud/internacion/internacion-helpers/internacion-header-control/internacion-header-control.component';

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

  private viewList: Array<string> = [];
  public viewList$ = new BehaviorSubject<Array<string>>([]);

  public botonesPool: Array<any> = [];

  public locacionId: string = "";
  private _currentLocation: LocacionHospitalaria;

  public serviciosOfrecidos: Servicio[] = [];

  public internaciones: SolicitudInternacion[] = [];

  public master_internacion: any;
  public master_periferia: any;
  public master_camas: any;
  public botonesPeriferia: BotonContador[] = [];


  //template Helpers
  public title = 'ESTADO DE OCUPACIÓN DE LAS LOCACIONES DE INTERNACIÓN'  
  public showData = false;

  public showEstadoOcupacion = true;
  public showEstadoDisponibilidad = true;
  public data$ = new BehaviorSubject('Helouuuu');
  
  constructor(
      private _isrv: InternacionService,
      private router: Router,
      private route: ActivatedRoute,
      public dialog: MatDialog,
      ){
  }

  ngOnInit(){
    this._isrv.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
    /****/
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

  /******************************************************************************/
  /******* Alta rapida paciente, eventEmiited By internacion-header-control ****/
  /****************************************************************************/
  altaRapidaPaciente(type){
    const dialogRef = this.dialog.open(InternacionAltaComponent, {
      width: '750px',
      data: {data : null}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.refreshView();
      }
    });

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
  }

  private showDisponiblesOrNotDisponible(selected : string){
      if(selected === CAMA_LIBRE){
          this.showEstadoOcupacion = false;
          this.showEstadoDisponibilidad = true;

      }else if(selected === CAMA_OCUPADA){
          this.showEstadoOcupacion = true;
          this.showEstadoDisponibilidad = false;

      }
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
    // debug-only: this.data$.next(locaciones)
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

    /********************************************************************/
    /******* Evento PACIENTES EN TRÁNSITO ver si mantener TODO      ****/
    /******************************************************************/
  onTransitoClick(locacion){
    // this.solicitudesInternacion$.subscribe(solicitudesInternacion => {
    //   const dialogRef = this.dialog.open(
    //     TransitoModalComponent,
    //     {
    //       width: '450px',
    //       data: {
    //         pacientes: solicitudesInternacion.map(s => s.requeridox),
    //         nombreCentroSalud: locacion.name
    //       }
    //     }
    //   );
    
    //   dialogRef.afterClosed().subscribe(
    //     res => {
    //     //TODO: derivar los pacientes
    //     }
    //   );
    // });

  }
  ///////////////////

  private initOnce(){
    // debug only: this.data$.next('Hellouuuu!')
    this.refreshViewList(this.capacidadesOptList);
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
      // debug only this.data$.next(list);

    }else{
      this.pool = null;
    }

    this.masterList = list.filter(t => t.code !== 'pool');

    this.showData = true;

  }


  /************************************************************************/
  checkBoxEmit(views){
    this.refreshViewList(views);
  }

  private refreshViewList(list){
    this.viewList = list.map(t => t.val) || [] ;
    this.viewList$.next(this.viewList);
  }


  /**************************************************************/
  /******* PROYECCIÓN DE OCUPACIÓN DE CAMAS TODO PENDIENTE  ****/
  /************************************************************/
  currentProyeccionDateEmit(fecha : Date){
      let fechaProyeccion = new Date();
      fechaProyeccion.setDate(fecha.getDate());
      fechaProyeccion.setHours(0,0,0,0);
      // this.currentLocation.estado_ocupacion.forEach( cama => {
      //     if(cama.estado !== 'LIBRE'){
      //         let date = parseInt(cama.fecha_prev_out.substring(0,2));
      //         let month = parseInt(cama.fecha_prev_out.substring(3,5));
      //         let year = parseInt(cama.fecha_prev_out.substring(6));

      //         let fecha_prev_out = new Date(year, (month-1), date);
      //         fecha_prev_out.setHours(0,0,0,0);
      //         if((fechaProyeccion > fecha_prev_out) || (fechaProyeccion.getTime() === fecha_prev_out.getTime())){
      //             cama.estado = 'Pronto a desocuparse'
      //         }else if(cama.estado == 'Pronto a desocuparse'){
      //                 cama.estado = 'ocupada';   
      //         }
      //     }
      // })
  }
  
}
