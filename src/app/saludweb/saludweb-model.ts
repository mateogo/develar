import { Asistencia } from "../salud/asistencia/asistencia.model";
import { Person } from '../entities/person/person';

export class SaludwebModel {
}

export class FechaBase {
    fe_inicio = ''; 
    fets_inicio = 0;
}

export class ValidationError {
    messageId: string;
    messageTxt: string;
}

export class EventUpdate {
	action: string;
    type: string;
    errors: Array<ValidationError>;
    token: Asistencia;
    person: Person;
}

export class AccessData {
    ndoc: string = '';
    telefono: string = '';
    fenactx: string = '';

}