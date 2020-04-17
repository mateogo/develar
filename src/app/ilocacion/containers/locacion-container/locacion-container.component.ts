import { Component, OnInit, ɵConsole } from "@angular/core";
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';

import { LocacionFacade } from '../../locacion.facade';
import { Observable } from 'rxjs';
import { BotonContador } from '../../../develar-commons/base.model';

import { locaciones as Locaciones} from '../../../models/camas';

import { BOTONES_BUFFERS } from './botones-buffers';
import { MatDialog } from '@angular/material/dialog';
import { CamaEstadoModalComponent } from '../../components/camas-mosaicos-component/cama-estado-modal/cama-estado-modal.component';
import { BufferModalComponent } from '../../components/buffer-modal/buffer-modal.component';

import {     SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, 
                    Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
                    MasterAllocation, AsignarRecursoEvent } from '../../../salud/internacion/internacion.model';

import { LocacionHospitalaria, Servicio} from '../../../entities/locaciones/locacion.model';

import { InternacionHelper }  from '../../../salud/internacion/internacion.helper';
import { InternacionService } from '../../../salud/internacion/internacion.service';

const CAMA_LIBRE = 'libre';
const CAMA_OCUPADA = 'ocupada';
const ASIGNAR = 'asignar';


@Component({
    selector :'locacion-container',
    templateUrl : './locacion-container.component.html',
    styleUrls : ['locacion-container.component.scss']
})
export class LocacionContainerComponent implements OnInit{

    //Locacion
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


    //template Helpers
    public showData = false;
    public title = 'ESTADO DE OCUPACIÓN'
    public capacidadTitle = 'Capacidad nominal: '

    public botonesPeriferia: BotonContador[] = BOTONES_BUFFERS;
    public showCamasOcupadas = true;
    public showCamasLibres = true;


    //ToBeDeprecated
    currentLocation : any = new Object(); //modifacarlo por su tipo (se uso para el object.assign)
    loadedLocationFronDB : any = new Object(); //modificarlo por su tipo
    totalCamas: number;
    msjSegunRadioButton : string = '';

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

    private initOnce(id){

        this.locacion$ = this._locacionFacade.locacion$;
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

    public locacionName: string;
    public locacionCode: string;
    public capacidadToPrint: string;

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


        // this.admision$ =    this._locacionFacade.loadPacientesEnAdmision$();
        // this.traslado$ =    this._locacionFacade.loadPacientesEnTraslado$();
        // this.salida$ =      this._locacionFacade.loadPacientesEnSalida$();
        // this.externacion$ = this._locacionFacade.loadPacientesEnExternacion$();
        // this.transito$ =    this._locacionFacade.loadPacientesEnTransito$();

        // /* Definir al actualización de los contadores de los botones */
        // this.admision$.subscribe(pacientes =>
        //     this.botonesPeriferia.find(b => b.id === 'admision').contador = (pacientes && pacientes.length ) || 0
        // );
        // this.traslado$.subscribe(pacientes =>
        //     this.botonesPeriferia.find(b => b.id === 'traslado').contador = (pacientes && pacientes.length ) || 0
        // )
        // this.salida$.subscribe(pacientes =>
        //     this.botonesPeriferia.find(b => b.id === 'salida').contador = (pacientes && pacientes.length ) || 0
        // )
        // this.externacion$.subscribe(pacientes =>
        //     this.botonesPeriferia.find(b => b.id === 'externacion').contador = (pacientes && pacientes.length ) || 0
        // )
        // this.transito$.subscribe(pacientes =>
        //     this.botonesPeriferia.find(b => b.id === 'transito').contador = (pacientes && pacientes.length ) || 0
        // )

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

        // /** Este sería el caso del VER TODO, por lo cual hay que traer las locaciones originales */
        // this.currentLocation.estado_ocupacion = this.loadedLocationFronDB.estado_ocupacion;
        // this.msjSegunRadioButton = this.calcularCamasDisponibles('todo');
    }

    private showDisponiblesOrNotDisponible(selected : string){
        if(selected === CAMA_LIBRE){
            this.showCamasOcupadas = false;
            this.showCamasLibres = true;

        }else if(selected === CAMA_OCUPADA){
            this.showCamasOcupadas = true;
            this.showCamasLibres = false;

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
            //TODO
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
        })

    }

}