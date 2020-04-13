import { Injectable } from "@angular/core";
import { LocacionState } from './state/locacion.state';
import { filter, tap, map } from 'rxjs/operators';
import { PacientesApi } from './api/pacientes.api';


@Injectable()
export class LocacionFacade {

    constructor(
        private _locacionState: LocacionState,
        private _pacientesApi: PacientesApi,
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
}