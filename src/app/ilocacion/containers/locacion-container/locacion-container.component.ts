import { Component, OnInit } from "@angular/core";
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

import { InternacionService } from '../../../salud/internacion/internacion.service';

import { AltaRapidaPacienteModalComponent } from '../../../develar-commons/alta-rapida-paciente-modal/alta-rapida-paciente-modal.component';
import { CamaEstadoModalComponent } from '../../components/camas-mosaicos-component/cama-estado-modal/cama-estado-modal.component';
import { BufferModalComponent } from '../../components/buffer-modal/buffer-modal.component';

import { BotonContador } from '../../../develar-commons/base.model';

import { SolicitudInternacion, AsignarRecursoEvent } from '../../../salud/internacion/internacion.model';

import { LocacionHospitalaria, Servicio} from '../../../entities/locaciones/locacion.model';

import { InternacionHelper }  from '../../../salud/internacion/internacion.helper';

const CAMA_LIBRE = 'libre';
const CAMA_OCUPADA = 'ocupada';
const ASIGNAR = 'asignar';
const UPDATE = 'update';
const EVOLUCIONAR = 'evolucionar';


@Component({
    selector :'locacion-container',
    templateUrl : './locacion-container.component.html',
    styleUrls : ['locacion-container.component.scss']
})
export class LocacionContainerComponent implements OnInit{

  //Locacion
  public locacionId: string = "";
  //public locacion$: Observable<LocacionHospitalaria>
  private _currentLocation: LocacionHospitalaria;

  public serviciosOfrecidos: Servicio[] = [];
  private capacidadesOptList = InternacionHelper.getOptionlist('capacidades')

  public internaciones: SolicitudInternacion[] = [];

  public master_internacion: any;
  public master_periferia: any;
  public master_camas: any;
  public botonesPeriferia: BotonContador[] = [];
 
  public locacionName: string;
  public locacionCode: string;
  public capacidadToPrint: string;

 
  //template Helpers
  public title = 'ESTADO DE OCUPACIÓN'
  public capacidadTitle = 'Capacidad nominal: '
  private viewList: Array<string> = [];

  public showData = false;
  public showCamasOcupadas = true;
  public showCamasLibres = true;

  constructor(
      private _locacionFacade: InternacionService,
      private router: Router,
      private route: ActivatedRoute,
      public dialog: MatDialog,
  ){
  }

  ngOnInit(){
      /****/
      this.showData = false;
      this.locacionId = this.route.snapshot.paramMap.get('id');
      this._locacionFacade.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
      /****/

      if(!this.locacionId){
          this._locacionFacade.openSnackBar('Debe tener seleccionado una locación', 'CERRAR')
          this.router.navigate(['/salud/gestion/recepcion']);
          return;
      }

      this.initOnce(this.locacionId)
  }

  navigateTo(e){
    e.preventDefault();
    e.stopPropagation();
    this.router.navigate(['/salud/coordinacion']);
  }

  private initOnce(id){
      this.refreshViewList(this.capacidadesOptList);

      this._locacionFacade.fetchLocacionById(id).then(locacion=>{
          if(locacion){
              this._currentLocation = locacion;
              this._locacionFacade.locacion = locacion;
              this.initLocationFacilities(locacion);
          }else {
              this._locacionFacade.openSnackBar('Locación NO ENCONTRADA', 'CERRAR')
              this.router.navigate(['/salud/gestion/recepcion']);
              return;
          }            
      })
  }

  private initLocationFacilities(locacion: LocacionHospitalaria){
      this.serviciosOfrecidos = this._locacionFacade.buildServiciosList(locacion);
      this.locacionCode = locacion.code
      this.locacionName = locacion.slug
      this.capacidadToPrint = InternacionHelper.capacidadDisponibleToPrint(this.serviciosOfrecidos)



      this.refreshAfectadosList(locacion);
  }

  private refreshAfectadosList(locacion: LocacionHospitalaria){
      this._locacionFacade.fetchInternacionesByLocationId(locacion._id).subscribe(internaciones =>{
          if(internaciones && internaciones.length){
              this.initAfectadosList(internaciones);
          }else {
              this.initAfectadosList([]);
          }

      })

  }

  private initAfectadosList(internaciones: SolicitudInternacion[]){
      this.internaciones = internaciones;
      this._locacionFacade.internaciones = this.internaciones;

      this.master_internacion = this._locacionFacade.buildEstadoInternacion(this.internaciones);
      this.master_periferia =   this._locacionFacade.buildEstadoPeriferia(this.internaciones);
      this.botonesPeriferia =   this._locacionFacade.getBotonesPeriferia(this.master_periferia);
      this.master_camas =       this._locacionFacade.buildEstadoCamas(this._currentLocation, this.internaciones)

      this.initLocacionData();

  }

  private initLocacionData(){
      //and... it's... showTime!!!
      this.showData = true;
  }

  /******************************************************************************/
  /******* Alta rapida paciente, eventEmiited By internacion-header-control ****/
  /****************************************************************************/
  altaRapidaPaciente(type){

    const dialogRef = this.dialog.open(AltaRapidaPacienteModalComponent, {
      width: '750px',
      data: {data : null}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result === UPDATE){
        this.refreshAfectadosList(this._currentLocation);
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
      this.showCamasOcupadas = true;
      this.showCamasLibres = true;
  }

  private showDisponiblesOrNotDisponible(selected : string){
      if(selected === CAMA_LIBRE){
          this.showCamasOcupadas = false;
          this.showCamasLibres = true;

      }else if(selected === CAMA_OCUPADA){
          this.showCamasOcupadas = true;
          this.showCamasLibres = false;

      }
  }

  
  /**************************************************/
  /******* Proyección de ocupación PENDING TODO  ***/
  /************************************************/
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

  /**************************************************************************/
  /******* Gestión de los CHECKBOS que determian qué facilidades mostrar ***/
  /************************************************************************/
  verifyServicio(servicio){
    let capacity = servicio.srvCapacidad;
    return (this.viewList.indexOf(capacity) === -1) ? false : true;
  }

  checkBoxEmit(views){
    this.refreshViewList(views);
  }

  private refreshViewList(list){
    this.viewList = list.map(t => t.val) || [] ;
  }

/********

class PacienteModel {
  name: string;
  dni: string;
  diagnostico: string;

}
class CamaModel {
  paciente: PacienteModel;
  camaId: string;
  estado: string;
  fecha_in: Date;
  fecha_prev_out: string;
}


*****/

  /**************************************************************************/
  /******* ALTA NOVEDADES PACIENTE: PENDIENTE ***/
  /************************************************************************/
  openPacienteModal(sinternacion: SolicitudInternacion){
    let recursos = this.buildDatosForPacienteModal(sinternacion);

      const dialogRef = this.dialog.open(
          CamaEstadoModalComponent,
          {
              width: '750px',
              data: {
                  sinternacion: sinternacion,
                  recursos: recursos
              }
          }
      );

      dialogRef.afterClosed().subscribe(result => {
        if(!result) return;

        if(result.action === ASIGNAR){
          this.asignarPacienteARecurso(result);

        } else if(result.action === EVOLUCIONAR){
          this.evolucionarPaciente(result)

        }
     
          //TODO: hacer lo que corresponda
      });
  }

  private buildDatosForPacienteModal(sinternacion: SolicitudInternacion){
    let servicio = sinternacion.internacion.servicio;
    let recursos = this.master_camas[servicio];
    let recursosLibres = recursos.filter(rr => rr.estado === 'libre');
    return recursosLibres;
  }


  /**************************************************************************/
  /******* muestra pacientes en  periferia  NO altera modelo            ****/
  /************************************************************************/
  onAfectadosPeriferiaEvent(periferia){
      let pacientes = this.master_periferia[periferia]
      if(!(pacientes && pacientes.length )){
        this._locacionFacade.openSnackBar('No hay casos pendientes','CERRAR')
        return;
      }

      const dialogRef = this.dialog.open(
          BufferModalComponent,
          {
              width: '80%',

              data: {
                titulo: 'Pendientes de alocar',
                solicitudes: pacientes
              }
          }
      )
      dialogRef.afterClosed().subscribe(result => {
          //VENTANA READ ONLY
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
      this._locacionFacade.asignarRecurso(event.sinternacion, this._currentLocation, event.servicio, event.recurso).subscribe(sol => {
          this.refreshAfectadosList(this._currentLocation);
          this._locacionFacade.openSnackBar('Actulización exitosa', 'CERRAR');
      })

  }

  private evolucionarPaciente(event: AsignarRecursoEvent){
      this._locacionFacade.evolucionarInternacion(event.sinternacion).subscribe(sol => {
          this.refreshAfectadosList(this._currentLocation);
          this._locacionFacade.openSnackBar('Actulización exitosa', 'CERRAR');
      })
  }

}