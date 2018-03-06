/*******************************************
*  COMMUNITY community Community
*/

interface AssetInCommunity {
  _id: string;
  assetId:      string ;
  path:         string ;
  slug:         string ;
  mimetype:     string ;
}

export class Community {
  id:          string;
  _id:         string;
  code:        string = "";
  displayAs:   string = "";
  name:        string = "";
  slug:        string = "";
  urlpath:     string = "";

  eclass:      string = "";
  etype:       string = "";

  description: string = "";

  estado:      string = "activa";

  userId:      string = "";
  perms: Perms = {
    owner:   ['r', 'w', 'x'],
    persons: ['r', 'w'],
    other:   ['r']
  };

  parents:     Array<string> = [];
  tagstr:      string = ""
  taglist:     Array<string> = [];

  assets: Array<AssetInCommunity> = [];

  constructor(){

  }
}


export class CommunityBase {
  id:          string;
  _id:         string;
  userId:      string = "";
  communityId:      string = "";
  code:        string = "";
  displayAs:   string = "";
  name:        string = "";
  slug:        string = "";
  urlpath:     string = "";

  eclass:      string = "";
  etype:       string = "";

  description: string = "";

  estado:      string = "activa";

  tagstr:      string = ""
  taglist:     Array<string> = [];

  assets: Array<AssetInCommunity> = [];

  constructor(entity?: Community){
    if(entity){
      this.code = entity.code;
      this.displayAs = entity.displayAs;
      this.name = entity.name;
      this.urlpath = entity.urlpath;
      this.slug = entity.slug;
      this.eclass = entity.eclass;
      this.etype = entity.etype;
      this.description = entity.description;
      this.estado = entity.estado;
      this.userId = entity.userId;
      this.tagstr = entity.tagstr;
      this.taglist = entity.taglist;
    }

  }
}


export class CommunityUserRelation{
  _id: string;
  communityId: string = "";
  userId:      string = "";
  isOwner:     boolean = false;
  roles:       Array<string> = [];
  code:        string = "";
  displayAs:   string = "";
  slug:        string = "";
  name:        string = "";
  urlpath:     string = "";
  eclass:      string = "";
  etype:       string = "";
  invMode:     string = "creator";
  fealta:      number = 0;
  feacep:      number = 0;
  estado:      string = "";
}

export interface CommunityTable{
  code: string;
  displayAs: string;
  slug: string;
  name: string;
  urlpath: string;
  communityId: string;
  userId: string;

  eclass:      string ;
  etype:       string ;

}


class CommunityTableData implements CommunityTable {
  _id: string = "";

  code:      string = "";
  displayAs: string = "";
  slug:      string = "";
  name:      string = "";
  urlpath:      string = "";
  eclass:    string = "" ;
  etype:     string = "" ;
  communityId: string = "";
  userId:    string = "";

  editflds = [0,0,0,0,0,0,0,0]

  constructor(data: any){
    this._id = data._id;
    this.code = data.code;
    this.displayAs = data.displayAs;
    this.slug = data.slug;
    this.name = data.name;
    this.urlpath = data.urlpath;
    this.eclass = data.eclass;
    this.etype = data.etype;
    this.communityId = data.communityId;
    this.userId = data.userId;

  }  
}

/*************
  PERMS
*********/
export interface Perms {
  owner: Array<string> ;
  persons: Array<string>;
  other: Array<string>;
}

/*************
  Selectors
*********/
const entityClass: Array<any> = [
    {val: 'no_definido',    label: 'Seleccione opción',   slug: 'Seleccione opción'  },
    {val: 'academica',      label: 'Académica',     slug: 'Académica'  },
    {val: 'investigacion',  label: 'Investigación', slug: 'Investigación'  },
    {val: 'proyecto',       label: 'Proyecto',      slug: 'Proyecto'  },
    {val: 'agencia',        label: 'Agencia',       slug: 'Agencia'  },
    {val: 'home',           label: 'Sitio base',    slug: 'Comunidad por omisión para mostrar en home'  },
];

const entityType = {
  default: [
    {val: 'no_definido',   label: 'Seleccione opción',  slug: 'Seleccione opción' },
    {val: 'general',       label: 'General',      slug: 'General' },
   ],
  academica: [
    {val: 'no_definido',   label: 'Seleccione opción',  slug: 'Seleccione opción' },
    {val: 'general',       label: 'General',      slug: 'General' },
    {val: 'po3',    label: 'PObj3',   slug: 'PObj3'  },
    {val: 'iutwc',    label: 'IntUsuWeb',   slug: 'IntUsuWeb'  },
    {val: 'as',    label: 'Arq Softwr',   slug: 'Arq Softwr'  },
   ],
  investigacion: [
    {val: 'no_definido',   label: 'Seleccione opción',  slug: 'Seleccione opción' },
    {val: 'general',       label: 'General',      slug: 'General' },
    {val: 'web',    label: 'Web',   slug: 'Web'  },
   ],
  agencia: [
    {val: 'no_definido',   label: 'Seleccione opción',  slug: 'Seleccione opción' },
    {val: 'general',       label: 'General',            slug: 'General' },
    {val: 'comunicacion',  label: 'Comunicación',       slug: 'Comunicación'  },
   ],
  proyecto: [
    {val: 'no_definido',   label: 'Seleccione opción',  slug: 'Seleccione opción' },
    {val: 'general',       label: 'General',      slug: 'General' },
    {val: 'refaccion',     label: 'Refacción',    slug: 'Refacción'  },
   ],
}

const entityTableActions = [
      {val: 'no_definido',   label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'editone',      label: 'Editar registro',    slug:'editone' },
      {val: 'navigate',     label: 'Navegar comunidad',    slug:'Cambiar a esta comunidad' },
]

function getBaseDataFromEntity(entity: Community): CommunityBase{
  let token = new CommunityBase(entity);
  return token
}

function baseDataToEntity(entity: Community, base: CommunityBase): Community{
  entity.code = base.code; 
  entity.displayAs = base.displayAs; 
  entity.name = base.name; 
  entity.urlpath = base.urlpath; 
  entity.slug = base.slug; 
  entity.eclass = base.eclass; 
  entity.etype = base.etype; 
  entity.description = base.description; 
  entity.tagstr = base.tagstr; 
  entity.taglist = base.taglist; 
  return entity;
}

function initNewModel(name:string, parent:string, perms: Perms, taglist: Array<string>){
  let entity = new Community();
  entity.name = name || "nueva comunidad";
  if(parent) entity.parents.push(parent);
  if(perms) entity.perms = perms;
  if(taglist){
    entity.taglist = taglist;
    entity.tagstr = taglist.join(' ');
  }

  return entity;
}

const daoConfig = {
  type: 'community',
  backendURL: 'api/communities',
  searchURL: 'api/communities/search'
}


class CommunityModel {
  constructor(){
  }

  getBaseData(entity: Community): CommunityBase{
    return getBaseDataFromEntity(entity);
  }

  updateBaseData(entity: Community, basedata: CommunityBase): Community{
    return baseDataToEntity(entity, basedata);
  }

  initNew(name:string, parent:string, perms: Perms, taglist: Array<string>){
    return initNewModel(name, parent, perms, taglist);
  }

  daoConfig(){
    return daoConfig;
  }

  getTypeList(cl){
    if(!cl || !entityType[cl]) return entityType.default;
    return entityType[cl];
  }

  getClassList(){
    return entityClass;
  }

  get tableActionOptions(){
    return entityTableActions;
  }

  buildCommunityTable(elist: Array<CommunityUserRelation>): CommunityTable[]{
    let list: Array<CommunityTable>;

    list = elist.map(item => {
      let token: CommunityTable = new CommunityTableData(item);
      return token;
    });

    return list;
  }

}

export const communityModel = new CommunityModel();
