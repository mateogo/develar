import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { BotonContador } from '../../develar-commons/base.model';
import { BOTONES_SERVICIOS } from '../containers/centro-operaciones/botones-servicios';

@Injectable()
export class BotonesApi{
    getBotones$(){
        return (
            new BehaviorSubject<BotonContador[]>(BOTONES_SERVICIOS)
        ).asObservable();
    }
}