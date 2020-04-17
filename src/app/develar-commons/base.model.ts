import { Tag } from './develar-entities';

/*************
  PERMS
*********/
export interface Perms {
  owner: Array<string> ;
  persons: Array<string>;
  other: Array<string>;
}

export interface BasicData {
  name:        string ; 
  slug:        string ; 
  description: string ; 
  taglist:     Array<string>;
}


export interface BotonContador {
    val: string,
    label: string,
    contador?: number
}
