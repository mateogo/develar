import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class LocacionState {

    private pacientes$ = new BehaviorSubject<any[]>(null);

    getPacientes$(){
        return this.pacientes$.asObservable();
    }

    setPacientes(pacientes){
        this.pacientes$.next(pacientes);
    }
}