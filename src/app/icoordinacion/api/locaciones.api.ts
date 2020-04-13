import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';
import { locaciones } from '../../models/camas';

@Injectable()
export class LocacionesApi {
    getLocaciones$(): Observable<any[]>{
        //TODO: llamar a la API
        return (
            new BehaviorSubject<any[]>(locaciones)
        ).asObservable();
    }
}