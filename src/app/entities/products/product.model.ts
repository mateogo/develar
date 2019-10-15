/*******************************************
*  PRODUCT product Product
*/

interface AssetInProduct {
  _id: string;
  assetId:      string ;
  path:         string ;
  slug:         string ;
  mimetype:     string ;
}

export class KitItem {
  productId: string;
  productCode: string;
  productName: string;
  productUME: string;
  item_qty: number; 
}

export class KitProduct {
  _id:         string;
  code:        string = "";
  name:        string = "";
  type:        string = "alimentos";
  slug:        string = "";
  qty:         number = 1;
  estado:      string = "activo";
  products:    Array<KitItem>;
}

export class KitProductTableData {
  _id: string = "";
  code: string = "";
  type: string = "";
  slug: string = "";
  qty: number = 1;
  name: string = "";
  estado: string = "";
  editflds = [0,0,0,0,0,0,0,0]


  constructor(data: any){
    this._id = data._id;
    this.slug = data.slug;
    this.code = data.code;
    this.estado = data.estado;
    this.name = data.name;
    this.type = data.type;
    this.qty = data.qty;
  }  
}





export interface UpdateProductEvent {
  action: string;
  type: string;
  token: KitProduct;
};

export class Product {
  id:          string;
  _id:         string;
  code:        string = "";
  name:        string = "";
  slug:        string = "";

  pclass:      string = "";
  ptype:       string = "";
  pbrand:      string = "";
  pmodel:      string = "";

  pinventory:  string = "";
  pume:        string = "";
  pformula:    string = "";

  description: string = "";
  estado:      string = "activo";
  tokens:      Array<string> = [];
  persons:     Array<string> = [];
  user:        string = "";
  userId:      string = "";
  perms: Perms = {
    owner:   ['r', 'w', 'x'],
    persons: ['r', 'w'],
    other:   ['r']
  };
  parents:     Array<string> = [];
  tagstr:      string = ""
  taglist:     Array<string> = [];

  assets: Array<AssetInProduct> = [];

  constructor(){

  }
}

export class ProductEvent {
  id:          string;
  _id:         string;
  eventType:   string = "alta";
  slug:        string = "";

  fe:          number = 0;
  feTxt:       string = "";
  locationId:  string = "";
  ownerId:     string = "";
  ownerName:   string = "";
  estado:      string = "activo";

}

/****** Product Identified by Serial Number ********/
export class Productsn {
  id:          string;
  _id:         string;
  code:        string = "";
  slug:        string = "";

  fe:          number = 0;
  feTxt:       string = "";

  productId: string = "";
  productName: string = "";

  actualLocationId: string = "";
  actualOwnerId: string = "";
  actualOwnerName: string = "";

  qt: number;
  ume: string;

  estado:      string = "activo";

  events: Array<ProductEvent> = [];

  constructor(){

  }
}


/****** Product Item ********/
export class Productit {
  id:          string;
  _id:         string;
  code:        string = "";
  slug:        string = "";

  ptype:       string = "";
  pbrand:      string = "";
  pmodel:      string = "";

  vendorId: string = "";
  productId: string = "";

  productname: string = "";
  vendorname: string = "";
  vendorurl:  string = "";
  vendorpl:   string = "";

  pume:        string = "";
  fume: string;

  moneda: string;
  pu: number;

  estado:      string = "activo";

  assets: Array<AssetInProduct> = [];

  constructor(){

  }
}

export interface ProductsnTable{
  code: string;
  feTxt: string;
  slug: string;
}

class ProductsnTableData implements ProductsnTable {
  _id: string = "";
  feTxt: string ="";
  code: string = "";
  slug: string = "";
  productName: string = "";
  actualOwnerName: string = "";
  estado: string = "";
  editflds = [0,0,0,0,0,0,0,0]
  constructor(data: any){
    this._id = data._id;
    this.feTxt = data.feTxt;
    this.slug = data.slug;
    this.code = data.code;
    this.actualOwnerName = data.actualOwnerName;
    this.estado = data.estado;
    this.productName = data.productName;
  }  
}



export interface ProductitTable{
  displayAs: string;
  code: string;
  ptype: string;
  slug: string;
  entityId: string;
  qt: number;
  ume: string;
  freq: number;
  fume: string;
  pu: number;
  vendorname: string;
  productname: string;
  moneda: string;
}

class ProductitTableData implements ProductitTable {
  _id: string = "";
  displayAs: string = "";
  ptype: string ="";
  code: string = "";
  slug: string = "";
  entityId: string = "";
  freq: number = 1;
  fume: string = "unidad";
  qt: number = 0;
  ume: string = "";
  pu: number = 0;
  vendorname: string = "";
  productname: string = "";
  moneda: string = "";
  fumetx: string = "";
  qtx: string = "";
  editflds = [0,0,0,0,0,0,0,0]
  constructor(data: any){
    this._id = data._id;
    this.displayAs = data.displayAs;
    this.slug = data.slug;
    this.ptype = data.ptype;
    this.code = data.code;
    this.entityId = data.entityId;
    this.qt = data.qt|| 0;
    this.ume = data.pume || 'unidad';
    this.freq = data.freq || 1;
    this.fume = data.fume || 'unidad';
    this.pu = data.pu || 0;
    this.moneda = data.moneda;
    this.vendorname = data.vendorname;
    this.productname = data.productname;
    this.fumetx = fumeList.find(item => item.val === this.fume).label;
    this.qtx = umeTx(this.ume, this.fume, this.fumetx, this.qt, this.freq);
  }  
}

function umeTx(ume, fume, fumetx, qt, freq){
  let text = ""
  if(freq === 1 && fume === 'unidad'){
    text = qt + ' ' + ume
  }else {
    text = qt + ' ' + ume + ' x ' + freq + ' ' + fumetx ;
  }
  return text;
}


/*************
  PERMS
*********/
export interface Perms {
  owner: Array<string> ;
  persons: Array<string>;
  other: Array<string>;
}

export interface ProductBaseData {
  code:        string ;
  name:        string ; 
  slug:        string ; 
  ptype:       string ;
  pclass:      string ;
  pbrand:      string;
  pmodel:      string;

  pinventory:  string;
  pume:        string;
  pformula:    string;
  description: string ; 
  taglist:     Array<string>;
}

/*************
  Selectors
*********/
const productClass: Array<any> = [
    {val: 'no_definido',    label: 'Seleccione opción',   slug: 'Seleccione opción'  },
    {val: 'alimentos',      label: 'Alimentos',           slug: 'Alimentos'  },
    {val: 'habitacional',   label: 'Habitacional',        slug: 'Habitacional'  },
    {val: 'sanitaria',      label: 'Sanitaria',           slug: 'Sanitaria'  },
    {val: 'cuidado',        label: 'Cuidado Personal',    slug: 'Cuidado Personal'  },
    {val: 'construccion',   label: 'Materiales de Construcción', slug: 'Materiales de Construcción'  },
    {val: 'hogar',          label: 'Equipam Hogar',       slug: 'Equipam Hogar' },
    {val: 'bdeuso',         label: 'Bien de Uso',         slug: 'Bien de Uso' },
    {val: 'bdeusotic',      label: 'Bien de Uso IT',      slug: 'Bien de Uso IT' },
    {val: 'consum',         label: 'Consumible',          slug: 'Consumible' },
    {val: 'consumtic',      label: 'Consumible IT',       slug: 'Consumible IT' },
    {val: 'prestahum',      label: 'Prestación humana',   slug: 'Prestación humana' },
    {val: 'alojamiento',    label: 'Alojamiento',         slug: 'Alojamiento' },
    {val: 'transporte',     label: 'Transporte',          slug: 'Transporte' },
    {val: 'pobjetivo',      label: 'Objetivo-producto',   slug: 'Producto Objetivo'  },
    {val: 'presultado',     label: 'Objetivo-resultado',  slug: 'Resultado Objetivo' },
    {val: 'pentregable',    label: 'Pr Entregable',       slug: 'Pr Entregable' },
    {val: 'prequerido',     label: 'Pr Requerido',        slug: 'Pr Requerido' },
    {val: 'instrumental',   label: 'Instrumental',        slug: 'Instrumental' },
    {val: 'movilidad',      label: 'Movilidad',           slug: 'Movilidad' },
    {val: 'servicios',      label: 'Servicios',           slug: 'Servicios' },
    {val: 'contratistas',   label: 'Contratistas',        slug: 'Contratistas' },
    {val: 'preventa',       label: 'Producto de Venta',   slug: 'Producto de Venta' },
    {val: 'opintura',       label: 'Pintura de obra',     slug: 'Pintura de obra' },
];

const productType = {
  default: [
    {val: 'no_definido',   label: 'Seleccione opción',  slug: 'Seleccione opción' },
    {val: 'general',       label: 'General',      slug: 'General' },
    {val: 'particular',    label: 'Particular',   slug: 'Particular' },
   ],

  pobjetivo: [
    {val: 'no_definido',     label: 'Seleccione opción',  slug:'Seleccione opción' },
    {val: 'objetivo',       label: 'Objetivo específico',          slug:'Objetivo específico' },
    {val: 'resultado',      label: 'Resultado esperado',         slug:'resultado' },
  ],

  pentregable: [
    {val: 'no_definido',  label: 'Seleccione opción', slug: 'Seleccione opción' },
    {val: 'informe',      label: 'informe',           slug: 'informe' },
    {val: 'proyecto',     label: 'proyecto',          slug: 'proyecto' },
    {val: 'estrategia',   label: 'estrategia',        slug: 'estrategia' },
    {val: 'registro',     label: 'registro',          slug: 'registro' },
    {val: 'aplicacion',   label: 'aplicación',        slug: 'aplicación' },
    {val: 'modulo',       label: 'módulo',            slug: 'módulo' },
    {val: 'tp',           label: 'trabajo práctico',  slug: 'trabajo práctico' },
    {val: 'instalacion',  label: 'instalación',       slug: 'instalación' },
    {val: 'cotizacion',   label: 'Item cotización',   slug:'Item cotización' },
    {val: 'presupuesto',  label: 'Item presupuesto',  slug:'Item presupuesto' },
    {val: 'expensas',     label: 'Item expensas',     slug:'Item expensas' },
  ],
  
  prequerido: [
    {val: 'no_definido',   label: 'Seleccione opción',  slug: 'Seleccione opción' },
    {val: 'documentacion', label: 'documentacion',  slug: 'documentacion' },
    {val: 'logistica',     label: 'logistica',  slug: 'logistica' },
    {val: 'traslados',     label: 'traslados',  slug: 'traslados' },
    {val: 'pasajes',       label: 'pasajes',  slug: 'pasajes' },
    {val: 'alojamiento',   label: 'alojamiento',  slug: 'alojamiento' },
    {val: 'viaticos',      label: 'viaticos',  slug: 'viaticos' },
    {val: 'seguridad',     label: 'seguridad',  slug: 'seguridad' },
    {val: 'infraestructura', label: 'infraestructura',  slug: 'infraestructura' },
    {val: 'ogastos',       label: 'ogastos',  slug: 'ogastos' },
    {val: 'acuerdos',      label: 'acuerdos',  slug: 'acuerdos' },
  ],
  prestahum: [
    {val: 'no_definido',   label: 'Seleccione opción',  slug: 'Seleccione opción' },
    {val: 'asesoramiento', label: 'Asesoramiento',  slug: 'asesoramiento' },
    {val: 'direccion',     label: 'Dirección',  slug: 'Dirección' },
    {val: 'proyecto',      label: 'Ger Proyecto',  slug: 'Ger Proyecto' },
    {val: 'calidad',       label: 'Ger Calidad',  slug: 'Ger Calidad' },
    {val: 'auditoria',     label: 'Auditor',  slug: 'Auditor' },
    {val: 'productor',     label: 'Productor',  slug: 'Productor' },
    {val: 'auxiliar',      label: 'Auxiliar',  slug: 'Auxiliar' },
    {val: 'escribano',     label: 'Escribano',  slug: 'Escribano' },
    {val: 'contador',      label: 'Contador',  slug: 'Contador' },
    {val: 'abogado',       label: 'Abogado',  slug: 'Abogado' },
  ],
  opintura: [
    {val: 'no_definido',   label: 'Seleccione opción',  slug: 'Seleccione opción' },
    {val: 'interior',      label: 'Pintura int',  slug: 'Pintura general interior' },
    {val: 'exterior',      label: 'Pintura ext',  slug: 'Pintura general exterior' },
    {val: 'pareda',        label: 'Al agua',  slug: 'Al agua' },
    {val: 'pareds',        label: 'Satinada',  slug: 'Satinada' },
    {val: 'barnizi',       label: 'Barniz int',  slug: 'Barniz interiores' },
    {val: 'barnize',       label: 'Barniz ext',  slug: 'Barniz ext' },
    {val: 'especial',      label: 'Pint esp',  slug: 'Pint esp' },
    {val: 'insumos',       label: 'Insum pint',  slug: 'Insum pint' },
  ]

}

const inventoryType: Array<any> = [
    {val: 'no_definido',   label: 'Seleccione opción',  slug: 'Seleccione opción'  },
    {val: 'noop',          label: 'No inventariable', slug: 'noop'  },
    {val: 'granel',        label: 'Granel',           slug: 'granel'  },
    {val: 'lote',          label: 'Lote',             slug: 'lote'  },
    {val: 'uidentificada', label: 'Un identificada',  slug: 'uidentificada'  },
];

const formulaType: Array<any> = [
    {val: 'no_definido',  label: 'Seleccione opción',  slug: 'Seleccione opción'  },
    {val: 'unidad',       label: 'Unidad',         slug: 'noop'  },
    {val: 'selaborado',   label: 'Semielaborado',  slug: 'granel'  },
    {val: 'sefantasma',   label: 'SE fantasma',    slug: 'lote'  },
    {val: 'contenedor',   label: 'Contenedor',     slug: 'uidentificada'  },
    {val: 'embalaje',     label: 'Embalaje',       slug: 'uidentificada'  },
];

const estadosOptList = [
      {val: 'no_definido',    label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'activo',      label: 'Activo',      slug:'Activo' },
      {val: 'baja',        label: 'Baja',        slug:'Baja' },
]

const umeList = [
        {val:'no_definido'  , label:'Unidad de Medida'},
        {val:'noop'         , label:'no contable'},
        {val:'unidad'       , label:'UN'},
        {val:'global'       , label:'Global'},
        {val:'porcentaje'   , label:'%'},
        {val:'hora'         , label:'hs'},
        {val:'dia'          , label:'día'},
        {val:'semana'       , label:'sem'},
        {val:'mes'          , label:'mes'},
        {val:'contrato'     , label:'contrato'},
        {val:'profesional'  , label:'profesional'},
        {val:'documento'    , label:'documento'},
        {val:'no_definido'  , label:'-------------'},
        {val:'pasaje'       , label:'pje'},
        {val:'tramo'        , label:'tram'},
        {val:'alojamiento'  , label:'aloj'},
        {val:'catering'     , label:'catering'},
        {val:'seguridad'    , label:'seg'},
        {val:'limpieza'     , label:'limpieza'},
        {val:'eqcomunic'    , label:'comunicación'},
        {val:'banioquim'    , label:'baño quím'},
        {val:'carpa'        , label:'carpa'},
        {val:'no_definido'  , label:'-------------'},        
        {val:'asistencia'   , label:'asistencia(s)'},
        {val:'persona'      , label:'persona(s)'},
        {val:'alquiler'     , label:'alquiler'},
        {val:'equipo'       , label:'equipo(s)'},
        {val:'tecnica'      , label:'técnica(s)'},
        {val:'escenario'    , label:'escenario(s)'},
        {val:'lucese'       , label:'luces Esc'},
        {val:'energiae'     , label:'energía Esc'},
        {val:'pantallae'    , label:'pantalla Esc'},
        {val:'sonidoe'      , label:'sonido Esc'},
        {val:'backline'     , label:'back line'},
        {val:'proyector'    , label:'proyector'},
        {val:'no_definido'  , label:'-------------'},
        {val:'seguro'       , label:'seguros'},
        {val:'constseco'    , label:'constr en seco'},
        {val:'mobiliario'   , label:'mobiliario'},
        {val:'trnsobra'     , label:'transporte obra arte'},
        {val:'trnscarga'    , label:'transporte carga'},
        {val:'trnspjero'    , label:'transporte pasajero'},
        {val:'marco'        , label:'marcos'},
        {val:'montaje'      , label:'montajes'},
        {val:'reproduccion' , label:'reproducciones'},
        {val:'no_definido'  , label:'-------------'},
        {val:'sadaic'       , label:'SADAIC'},
        {val:'argentores'   , label:'ARGENTORES'},
        {val:'derechos'     , label:'Derechos'},
        {val:'no_definido'  , label:'-------------'},
        {val:'banner'       , label:'banners'},
        {val:'cartel'       , label:'cartelería'},
        {val:'folleto'      , label:'folletos'},
        {val:'publicacion'  , label:'publicación'},
        {val:'no_definido'  , label:'-------------'},
        {val:'merchandising', label:'merchandising'},
        {val:'no_definido'  , label:'-------------'},
        {val:'grafica'      , label:'gráfica'},
        {val:'buso'         , label:'bienes de uso'},
        {val:'consumible'   , label:'consumible'},
        {val:'instalacion'  , label:'instalación'},
        {val:'obraartistica', label:'obra artística'},
        {val:'ciclo'        , label:'ciclo'},
        {val:'produccion'   , label:'producción'},
        {val:'presentacions', label:'presentaciones'},
        {val:'cubierto'     , label:'cubierto'},
        {val:'viaje'        , label:'viaje'},
        {val:'habitacion'   , label:'habitación'},
        {val:'funcion'      , label:'función'},
        {val:'congreso'     , label:'congreso'},
        {val:'litro'        , label:'litro'},
        {val:'metro'        , label:'metro'},
        {val:'kilo'         , label:'kilo'},
        {val:'otros'        , label:'otros'}
];


const fumeList = [
        {val:'no_definido'  , label:'Unidad de Medida'},
        {val:'unidad'       , label:'UN'},
        {val:'porcentaje'   , label:'%'},
        {val:'hora'         , label:'hs'},
        {val:'dia'          , label:'días'},
        {val:'semana'       , label:'sem'},
        {val:'mes'          , label:'mes'},
        {val:'persona'      , label:'per'},
        {val:'espacio'      , label:'amb'},
        {val:'no_definido'  , label:'-------------'},
        {val:'pasaje'       , label:'pje'},
        {val:'alojamiento'  , label:'aloj'},
        {val:'tramo'        , label:'tram'},
];

const kitTypeOptList = [
    {val: 'no_definido',   label: 'Seleccione opción' },
    {val: 'alimentos',     label: 'Alimentos'  },
];

const productTableActions = [
      {val: 'no_definido',   label: 'Seleccione opción',  slug:'Seleccione opción' },
      {val: 'editone',      label: 'Editar registro',    slug:'editone' },
]

function initNewModel(name:string, parent:string, perms: Perms, taglist: Array<string>){
  let product = new Product();
  product.name = name || "nuevo producto";
  if(parent) product.parents.push(parent);
  if(perms) product.perms = perms;
  if(taglist){
    product.taglist = taglist;
    product.tagstr = taglist.join(' ');
  }

  return product;
}

function initNewProductItModel(slug:string){
  let product = new Productit();
  product.slug = slug || "nuevo item producto";
  return product;
}

function initNewProductSerialModel(slug:string){
  let product = new Productsn();
  product.slug = slug || "nueva instancia producto identificado";
  return product;
}

function buildNewSerial(code: string, parent: Product, event:ProductEvent){
  let product = new Productsn();
  product.code = code;
  product.productId = parent._id;
  product.productName = parent.slug;
  product.qt = 1;
  product.ume = "unidad";
  product.fe = event.fe;
  product.feTxt = event.feTxt;
  product.estado = event.estado;
  product.actualLocationId = event.locationId;
  product.actualOwnerId = event.ownerId;
  product.actualOwnerName = event.ownerName;
  product.slug = event.slug || "nueva instancia producto identificado";
  product.events.push(event);
  return product;
}

const daoConfig = {
  type: 'product',
  backendURL: 'api/products',
  searchURL: 'api/products/search'
}

class ProductModel {
  constructor(){
  }

  initNew(name:string, parent:string, perms: Perms, taglist: Array<string>){
    return initNewModel(name, parent, perms, taglist);
  }

  initNewProductItem(name:string){
    return initNewProductItModel(name);
  }

  initNewProductSerial(name:string){
    return initNewProductSerialModel(name);
  }

  buildNewProductSerial(code: string, parent: Product, event:ProductEvent){
    let serial = buildNewSerial(code, parent, event);
    return serial;
  }

  daoConfig(){
    return daoConfig;
  }

  getProductTypeList(cl){
    if(!cl || !productType[cl]) return productType.default;
    return productType[cl];
  }

  getProductClassList(){
    return productClass;
  }

  getProductInventoryList(){
    return inventoryType;
  }
  
  getProductUmeList(){
    return umeList;
  }

  getProductFumeList(){
    return fumeList;
  }
  
  getProductFormulaList(){
    return formulaType;
  }

  get tableActionOptions(){
    return productTableActions;

  }

  buildProductTable(plist: Array<Productit>): ProductitTable[]{
    let list: Array<ProductitTable>;

    list = plist.map(item => {
      let token: ProductitTable = new ProductitTableData(item);
      return token;
    });

    return list;
  }

  buildSerialTable(plist: Array<Productsn>): ProductsnTable[]{
    let list: Array<ProductsnTable>;

    list = plist.map(item => {
      let token: ProductsnTable = new ProductsnTableData(item);
      return token;
    });

    return list;
  }


}

export const productModel = new ProductModel();

const optionsLists = {
   default: kitTypeOptList,
   kittype: kitTypeOptList,
   estado: estadosOptList,
}

function getLabel(list, val){
    let t = list.find(item => item.val === val)
    return t ? t.label : val;
}

export class KitProductModel {

  static getOptionlist(type){
    return optionsLists[type] || optionsLists['default'];
  }

  static getOptionLabel(type, val){
    if(!val) return 'no-definido';
    if(!type) return val;
    return getLabel(this.getOptionlist(type), val);
  }

  static buildKitTable(plist: Array<KitProduct>): KitProductTableData[]{
    let list: Array<KitProductTableData>;

    list = plist.map(item => new KitProductTableData(item) );

    return list;
  }



}


//Julio Fernandez baraibar