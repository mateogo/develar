import { Action } from '@ngrx/store';
import { Antecedente } from '../model/antecedente';

export enum AntecedenteActionTypes {
  LoadAntecedentes = '[Antecedente] Load Antecedente'
}

export class LoadAntecedente implements Action {
  readonly type = AntecedenteActionTypes.LoadAntecedentes;
  constructor(public payload: Antecedente){}
}

export type AntecedenteActions = LoadAntecedente;
