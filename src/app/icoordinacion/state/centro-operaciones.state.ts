import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class CentroOperacionesState {

    private solicitudes$ = new BehaviorSubject<any[]>(null);
    private locaciones$  = new BehaviorSubject<any[]>(null);

    getSolicitudes$(){
        return this.solicitudes$.asObservable();
    }

    getLocaciones$(){
        return this.locaciones$.asObservable();
    }

    setSolicitudes(solicitudes: any[]){
        this.solicitudes$.next(solicitudes);
    }

    setLocaciones(locaciones: any[]){
        this.locaciones$.next(locaciones);
    }
}