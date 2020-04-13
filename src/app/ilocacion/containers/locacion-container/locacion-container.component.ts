import { Component, OnInit, ɵConsole } from "@angular/core";
import { locaciones as Locaciones} from '../../../models/camas';
import { LocacionFacade } from '../../locacion.facade';
import { Observable } from 'rxjs';
import { BotonContador } from '../../../develar-commons/base.model';

import { BOTONES_BUFFERS } from './botones-buffers';
import { MatDialog } from '@angular/material/dialog';
import { CamaEstadoModalComponent } from '../../components/camas-mosaicos-component/cama-estado-modal/cama-estado-modal.component';
import { BufferModalComponent } from '../../components/buffer-modal/buffer-modal.component';

@Component({
    selector :'locacion-container',
    templateUrl : './locacion-container.component.html',
    styleUrls : ['locacion-container.component.scss']
})
export class LocacionContainerComponent implements OnInit{

    locaciones : any = new Object(); //modifacarlo por su tipo (se uso para el object.assign)
    locaciones_original : any = new Object(); //modificarlo por su tipo
    totalCamas: number;
    admision$: Observable<any>;
    traslado$: Observable<any>;
    salida$: Observable<any>;
    msjSegunRadioButton : string = '';
    tipos = [
        {
            id: 'UTI',
            descripcion: 'Unidad de Terapia Intensiva'
        },
        {
            id: 'UTE',
            descripcion: 'Unidad de Terapia Intermedia'
        },
        {
            id: 'IS',
            descripcion: 'Internación simple'
        },
        {
            id: 'AIS',
            descripcion: 'Aislamiento'
        },
    ];

    botonesBuffers: BotonContador[] = BOTONES_BUFFERS;

    constructor(
        private _locacionFacade: LocacionFacade,
        public dialog: MatDialog,
    ){
        Object.assign(this.locaciones_original,Locaciones[0]);
        Object.assign(this.locaciones,this.locaciones_original); //me guardo un atributo para el filtrado
        this.locaciones_original.estado_ocupacion = this.locaciones.estado_ocupacion;
        this.totalCamas = this.locaciones_original.camas.uti + this.locaciones_original.camas.ti + this.locaciones_original.camas.conext + this.locaciones_original.camas.internacion;
        this.msjSegunRadioButton = this.calcularCamasDisponibles('todo');
        console.log(this.msjSegunRadioButton)
    }

    ngOnInit(){
        this.admision$ = this._locacionFacade.loadPacientesEnAdmision$();
        this.traslado$ = this._locacionFacade.loadPacientesEnTransito$();
        this.salida$ = this._locacionFacade.loadPacientesEnSalida$();

        /* Definir al actualización de los contadores de los botones */
        this.admision$.subscribe(pacientes =>
            this.botonesBuffers.find(b => b.id === 'adm').contador = pacientes.length
        );
        this.traslado$.subscribe(pacientes =>
            this.botonesBuffers.find(b => b.id === 'tra').contador = pacientes.length
        )
        this.salida$.subscribe(pacientes =>
            this.botonesBuffers.find(b => b.id === 'sal').contador = pacientes.length
        )

        //TODO
        this.botonesBuffers.find(b => b.id === 'trn').contador = 0;
        this.botonesBuffers.find(b => b.id === 'ext').contador = 0;
    }

    calcularCamasDisponibles(seleccion : string) : string{
        console.log("ejecutado")
        switch(seleccion){
            case 'todo' : {
                let disponibles : number = 0;
                this.locaciones_original.estado_ocupacion.forEach(cama => {
                    if(cama.estado === 'LIBRE'){
                        disponibles++;
                    }
                }
                )
                console.log(disponibles)
            return 'Disponibles '+disponibles+' de '+this.locaciones_original.estado_ocupacion.length;
            }
        }


    }
    
    radioSelectedOption(e){

        /**Trabajamos con la selección recibida del component hijo */
        switch(e.value){
            case 0 : { this.showAllCamas(); break;};
            case 1 : { this.showDisponiblesOrNotDisponible('LIBRE'); break;};
            case 2: { this.showDisponiblesOrNotDisponible('ocupada'); break;}
        }
    }

    showAllCamas(){
        /** Este sería el caso del VER TODO, por lo cual hay que traer las locaciones originales */
        this.locaciones.estado_ocupacion = this.locaciones_original.estado_ocupacion;
        this.msjSegunRadioButton = this.calcularCamasDisponibles('todo');
        }

    showDisponiblesOrNotDisponible(estado_ocupacion : string){
        /** Vamos a filtrar segun el parametro recibido */
        let filtrado = [];
        this.locaciones_original.estado_ocupacion.forEach( cama => {
            if( cama.estado === estado_ocupacion){
                filtrado.push(cama);
            }
        })
        this.locaciones.estado_ocupacion = filtrado;
        if(estado_ocupacion === 'LIBRE'){
            this.msjSegunRadioButton = 'Disponibles '+filtrado.length;
        }else if(estado_ocupacion === 'ocupada'){
            this.msjSegunRadioButton = 'Ocupadas '+filtrado.length;
        }
    }

    currentProyeccionDateEmit(fecha : Date){
        
        let fechaProyeccion = new Date();
        fechaProyeccion.setDate(fecha.getDate());
        fechaProyeccion.setHours(0,0,0,0);
        this.locaciones.estado_ocupacion.forEach( cama => {
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
        e.length === 0 ? Object.assign(this.locaciones,this.locaciones_original) : null;
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
                        this.locaciones.estado_ocupacion = filtrado;
                        break; }
                    case 1 :{
                        filtrado = this.showCamasService('ti',filtrado);
                        this.locaciones.estado_ocupacion = filtrado;
                        break; }
                    // case 2 :{ filtrado = this.showCamasService(''); break };
                }
            })
        }
        


        
    }

    showCamasService(tipo : string, filtro? : any){
        
        if(filtro !== undefined){
            this.locaciones_original.estado_ocupacion.forEach(cama => {
                if(cama.tipo === tipo){
                    filtro.push(cama);
                }
            })
            console.log("devuelve --> %o",filtro)
            return filtro;
        }else{
        let filtrado = [];
        this.locaciones_original.estado_ocupacion.forEach(cama => {
            if(cama.tipo === tipo){
                filtrado.push(cama);
            }
        })
        console.log(filtrado)
        this.locaciones.estado_ocupacion = filtrado;
        return filtrado;
        }
        
    }

    openPacienteModal(pacienteId){
        const dialogRef = this.dialog.open(
            CamaEstadoModalComponent,
            {
                width: '750px',
                data: {
                    cama: this.locaciones.estado_ocupacion[0]
                }
            }
        );

        dialogRef.afterClosed().subscribe(result => {
            //TODO: hacer lo que corresponda
        });
    }


    onBotoneraClick(botonId){
        //TODO: botonera de buffers

        let waitFor;
        switch(botonId){
            case('adm'):
                waitFor = this.admision$;
                break;
            case('tra'):
                waitFor = this.traslado$;
                break;
        }

        waitFor.subscribe(pacientes => {
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
        });
    }
    
}