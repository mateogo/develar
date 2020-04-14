import { Injectable } from "@angular/core";
import { Router, ActivatedRoute, UrlSegment } from '@angular/router';
import { filter, tap, map } from 'rxjs/operators';

import { PacientesApi } from './api/pacientes.api';
import { LocacionState } from './state/locacion.state';

import {     SolicitudInternacion, Novedad, Locacion, Requirente, Atendido, Transito, 
                    Internacion, SolInternacionBrowse, SolInternacionTable, InternacionSpec,
                    MasterAllocation } from '../salud/internacion/internacion.model';

import { InternacionHelper }  from '../salud/internacion/internacion.helper';
import { InternacionService } from '../salud/internacion/internacion.service';


@Injectable()
export class LocacionFacade {

    constructor(
        private _locacionState: LocacionState,
        private _pacientesApi: PacientesApi,
        private intSrv: InternacionService,

    ){ }

    loadPacientesEnTransito$(){
        return this._pacientesApi.getPacientesFromLocacion$('').pipe(
            tap(pacientes => this._locacionState.setPacientes(pacientes)),
            map(pacientes => pacientes.filter(
                paciente => paciente.pool === 'transito'
            ))
        );
    }

    loadPacientesEnAdmision$() {
        return this._pacientesApi.getPacientesFromLocacion$('').pipe(
            tap(pacientes => this._locacionState.setPacientes(pacientes)),
            map(pacientes => pacientes.filter(
                paciente => paciente.pool === 'admision'
            ))
        );
    }

    loadPacientesEnTraslado$() {
        return this._pacientesApi.getPacientesFromLocacion$('').pipe(
            tap(pacientes => this._locacionState.setPacientes(pacientes)),
            map(pacientes => pacientes.filter(
                paciente => paciente.pool === 'traslado'
            ))
        );
    }

    loadPacientesEnSalida$(){
        return this._pacientesApi.getPacientesFromLocacion$('').pipe(
            tap(pacientes => this._locacionState.setPacientes(pacientes)),
            map(pacientes => pacientes.filter(
                paciente => paciente.pool === 'salida'
            ))
        );
    }

    /************************/
    /******* Hepers ********/
    /**********************/
    actualRoute(snap: string, mRoute: UrlSegment[]){
        this.intSrv.actualRoute(snap, mRoute)
    }

}

//http://develar-local.co:4200/salud/internacion/locacion/5e90b3b0b001680e2b5ba6c0