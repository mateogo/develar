import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PacientesApi {

    getPacientesFromLocacion$(locacion){
        //TODO: llamar a la API
        return (
            new BehaviorSubject<any[]>(PACIENTES)
        ).asObservable();
    }
}

const PACIENTES = [
    {
        dni: '11222333',
        name: 'Jorge López',
        diagnostico: 'GHI',
        pool: 'transito'
    },
    {
        dni: '22334455',
        name: 'Juan Pérez',
        diagnostico: 'DEF',
        pool: 'transito'
    },
    {
        dni: '33445566',
        name: 'Rosa Martínez',
        diagnostico: 'ABC',
        pool: 'admision'
    },
    {
        dni: '44556677',
        name: 'Eduardo Sánchez',
        diagnostico: 'UVW',
        pool: 'admision'
    },
    {
        dni: '92334455',
        name: 'Ana Romero',
        diagnostico: 'RST',
        pool: 'admision'
    },
    {
        dni: '93334455',
        name: 'Ricardo Fernández',
        diagnostico: 'OPQ',
        pool: 'traslado'
    },
    {
        dni: '91223344',
        name: 'Juana Rodríguez',
        diagnostico: 'XYZ',
        pool: 'salida'
    },
];