import { Action } from '@ngrx/store';
import { Antecedente } from '../model/antecedente';

export enum AntecedentesApiActionTypes {
  SearchSuccess = '[Antecedentes/API] SearchSuccess',
  SearchFailure = '[Antecedentes/API] SearchFailure',
}

/**
 * Every action is comprised of at least a type and an optional
 * payload. Expressing actions as classes enables powerful
 * type checking in reducer functions.
 *
 * See Discriminated Unions: https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
 */

export class SearchSuccess implements Action {
  readonly type = AntecedentesApiActionTypes.SearchSuccess;
  constructor(public payload: Antecedente){}

}

export class SearchFailure implements Action {
  readonly type = AntecedentesApiActionTypes.SearchFailure;
  constructor(public payload: string){}

}
export type AntecedentesApiActions = SearchSuccess | SearchFailure;
