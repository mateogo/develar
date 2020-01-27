/***************************
	develar-commons entities
**************************/
import { CardGraph } from '../bookshelf/cardgraph.helper';



/*******************************************
*  Common declarations
*/
const newEntityConfirm = {
  width:  '330px',
  height: '300px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    caption:'Alta de nueva entidad',
    title: 'Confirme la acción',
    body: 'Se dará de alta: ',
    accept:{
      action: 'accept',
      label: 'Aceptar'
    },
    cancel:{
      action: 'cancel',
      label: 'Cancelar'
    }
  }
};


export class Serial {
    type:string;
    name:string;
    tserial:string;
    sector:string;
    tdoc:string;
    letra:string;
    anio:number;
    mes:number;
    dia:number;
    estado:string;
    punto:number;
    pnumero:number;
    offset:number;
    slug:string;
    compPrefix:string;
    compName:string;
    showAnio:boolean;
    resetDay:boolean;
    fe_ult:number;
}

const LETRAS = ['X', 'Q', 'J', 'A', 'D'];
// X:normal; Q:especiales; J:tercera edad; A:bebes; D:direccion

function letraSerial(peso): string{
  if(!peso || peso > 4 || peso < 0) peso = 0;

  return LETRAS[peso];
}


/*************
  PERMS
*********/
interface Perms {
  owner: Array<string> ;
  persons: Array<string>;
  other: Array<string>;
}



/*******************************************
*  Asset ASSET Asset
*/

const assetTypes: Array<any> = [
    {val: 'no_definido',   label: 'Seleccione opción',  slug:'Seleccione opción' },
    {val: 'jpg',          label: 'jpg',          slug:'Imagen JPG' },
    {val: 'gif',          label: 'gif',          slug:'Imagen GIF' },
    {val: 'png',          label: 'png',          slug:'Imagen PNG' },
    {val: 'pdf',           label: 'pdf',          slug:'Documento PDF' },
    {val: 'word',         label: 'word',         slug:'Documento Word' },
];

export class Asset {
	id: string;
	_id: string;
  assetId:      string = "";
  isUploaded:   boolean = true;
  filename:     string = "";
  path:         string = "";
  slug:         string = "";
  description:  string = "";
  server:       string = "";
  originalname: string = "";
  encoding:     string = "";
  mimetype:     string = "";
  size:         string = "";
  upload:       string = "";

  estado:       string = "";
  avance:       string = "";
  tagstr:       string = "";
  taglist:      string = "";
  scope:        string = "";


  files = [];

	constructor(url?: string){
		this.assetId = url;
		this.filename = url;
		this.slug = url;
		this.path = url;
	}
}

export class ExternalAsset extends Asset {
  id: string;
  _id: string;
  assetId:      string = "";
  isUploaded:   boolean = true;
  filename:     string = "";
  path:         string = "";
  slug:         string = "";
  description:  string = "";
  server:       string = "";
  originalname: string = "";
  encoding:     string = "";
  mimetype:     string = "";
  size:         string = "";
  upload:       string = "";
  files = [];

  constructor(url?: string){
    super(url);
    this.isUploaded = false;
    this.assetId = url;
    this.path = url;
    this.slug = url;
    // estos datos sólo interesan si es un asset de cuerpo-presente
    this.filename = '';
    this.originalname = '';
  }
}
  
export class AssetFile {
	id: string;
	_id: string;
  filename:     string = "";
  path:         string = "";
  originalname: string = "";
  encoding:     string = "";
  mimetype:     string = "";
  size:         string = "";
  destination:  string = "";
  uploadtime:   number = 0;
  upload:       string = "";

	constructor(){
	}
}


class AssetModel {
  constructor(){

  }

  initAsset(data?):Asset {
    data = data || {};
    const card = new Asset('Sub contenido');
    Object.assign(card, data);
    return card;
  }

  confirmSaveMessage(){
    return newEntityConfirm;
  }
  getAssetTypes(){
    return assetTypes;
  }
  
  initNewExternalAsset(url){
    let asset = new ExternalAsset(url);
    return asset;
  }


}

export const assetModel = new AssetModel();




/*******************************************
*  FOLDER folder Folder
*/

interface AssetInFolder {
  _id: string;
  assetId:      string ;
  path:         string ;
  slug:         string ;
  mimetype:     string ;
}

export class Folder {
  id:          string;
  _id:         string;
  name:        string = "";
  slug:        string = "";
  description: string = "";
  estado:      string = "activa";
  tokens:      Array<string> = [];
  persons:     Array<string> = [];
  owner:       string = "";
  perms: Perms = {
    owner:   ['r', 'w', 'x'],
    persons: ['r', 'w'],
    other:   ['r']
  };
  parents:     Array<string> = [];
  tagstr:      string = ""
  taglist:     Array<string> = [];

  assets: Array<AssetInFolder> = [];

  constructor(){

  }
}


function initFolder(name:string, parent:string, perms: Perms, taglist: Array<string>){
  let folder = new Folder();
  folder.name = name || "";
  if(parent) folder.parents.push(parent);
  if(perms) folder.perms = perms;
  if(taglist){
    folder.taglist = taglist;
    folder.tagstr = taglist.join(' ');
  }

  return folder;
}


class FolderModel {
  constructor(){

  }

  initNewFolder(name:string, parent:string, perms: Perms, taglist: Array<string>){
    return initFolder(name, parent, perms, taglist);
  }


}
export const folderModel = new FolderModel();



/*******************************************
*  Google stuff
*/
export class GoogleSearchResponse {
  kind: string;
  url: object;
  queries: object;
  context: object;
  searchInformation: object;
  spelling: object;
  items: Array<any>;

}

export const searchMachines: Array<any> = [
    {val: 'hack',          label: 'Explorar URL',        slug:'Explorar URL' },
    {val: 'community_prg', label: 'Stackoverflow',       slug:'Foros stackoverflow' },
    {val: 'academica',     label: 'Academica',           slug:'Sitios académicos' },
    {val: 'ari',            label: 'ARI',                 slug:'Asuntos regulatorios' },
    {val: 'diarios_nac',    label: 'Diarios Nacionales',  slug:'Diarios nacionales' },
];


/*******************************************
*  TAG tag Tag
*/
interface parentTag {
  id:  string,
  type: string,
  slug: string,
};

export class Tag {
  id:        string;
  _id:       string;
  name:      string = "";
  slug:      string = "";
  type:      string = "";
  target:    string = "activa";
  user:      string = "";
  parents:   Array<parentTag> = [];

  constructor(){

  }
}


