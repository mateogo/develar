import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from 'rxjs';
import { CentroOperacionesState } from './state/centro-operaciones.state';
import { SolicitudesApi } from './api/solicitudes.api';
import { LocacionesApi } from './api/locaciones.api';
import { tap } from 'rxjs/operators';
import { BotonContador } from '../develar-commons/base.model';

import { BOTONES_SERVICIOS } from './containers/centro-operaciones/botones-servicios';
import { BotonesApi } from './api/botones.api';

@Injectable()
export class CentroOperacionesFacade {

    constructor(
        private _state: CentroOperacionesState,
        private _solicitudesApi: SolicitudesApi,
        private _locacionesApi: LocacionesApi,
        private _botonesApi: BotonesApi,
    ){ }

    loadSolicitudesInternacion$(): Observable<any[]>{
        let obs = this._solicitudesApi.getSolicitudesInternacion$().pipe(
            tap(solicitudes => this._state.setSolicitudes(solicitudes))
        );

        obs.subscribe();

        return obs;
    }

    loadLocaciones$(): Observable<any[]>{
        let obs = this._locacionesApi.getLocaciones$().pipe(
            tap(locaciones => this._state.setLocaciones(locaciones))
        );

        obs.subscribe();

        return obs;
    }

    loadBotonesServicios$(): Observable<BotonContador[]>{
        let bs = new BehaviorSubject<BotonContador[]>(null);

        this._botonesApi.getBotones$().subscribe(botones => {
            //Cada botón observa si cambia la cantidad de solicitudes de su tipo,
            //para actualizar su contador en consecuencia
            botones.forEach(boton => {
                this._state.getSolicitudes$().subscribe(solicitudes => {
                    if(solicitudes){
                        boton.contador = solicitudes.filter(
                            solicitud => solicitud.triage.servicio == boton.val
                        ).length
                    }
                });
            });

            bs.next(botones);
        });

        return bs.asObservable();
    }
}