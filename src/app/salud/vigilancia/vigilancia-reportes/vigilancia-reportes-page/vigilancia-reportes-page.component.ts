import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { VigilanciaSeguimientoComponent } from '../../vigilancia-zmodal/vigilancia-seguimiento/vigilancia-seguimiento.component';

import { SaludController } from '../../../salud.controller';

import {  Person, personModel } from '../../../../entities/person/person';

import { 	Asistencia, 
          AsistenciaTable,
          VigilanciaBrowse,
          AsistenciaSig, 
          UpdateAsistenciaEvent,
					AsistenciaHelper } from '../../../asistencia/asistencia.model';

const SEARCH = 'search';
const SEARCH_NEXT = 'search_next';

const EXPORT = 'export';

const UPDATE_MULTIPLE = 'update_multiple';

const R_DOMICILIOS = 'DOMICILIOS'
const R_IVR = 'LLAMADOSIVR'
const R_LLAMADOS = 'LLAMADOSEPIDEMIO'
const R_LABORATORIO = 'LABORATORIO'
const R_CONTACTOS = 'REDCONTACTOS'
const R_ASIGNACION = 'ASIGNACIONCASOS'
const R_SINSEGUIMIENTO = 'SINSEGUIMIENTO'
const R_MANAGECONTACTOS = 'CONTACTOS'

const ROLE_ADMIN = 'vigilancia:admin';

@Component({
  selector: 'vigilancia-reportes-page',
  templateUrl: './vigilancia-reportes-page.component.html',
  styleUrls: ['./vigilancia-reportes-page.component.scss']
})
export class VigilanciaReportesPageComponent implements OnInit {
  public searchTitle = 'Reportes Vigilancia Epidemiológica';
  public title = 'VIGILANCIA EPIDEMIOLÓGICA';
  public unBindList = [];
  public query: VigilanciaBrowse = new VigilanciaBrowse();

  public openBrowseEditor = true;
  public usersMap: Map<any,any>;
  public usersMapArray: Array<any> = [];
  public asignacionReportList: Array<any>;
  public showData =  false;
	public showTable = false;
  public showEditor = false;
  public renderMap = false;
  public renderGraph = false;
  public showAsignacionUsuarios = false;
  public showGraph = false;
  private actualParameter = 'no_definido';

  public zoom = 15;
  public baseLatLng = {};
  public mapData: AsistenciaSig[] = [];
  public tableActualColumns: Array<string> = [];

  public hasExport = true;

  // Sol de Asistencia
  public asistenciasList: Asistencia[];
  public currentAsistencia:Asistencia;

  public ciudadesList =   personModel.ciudades;
  public changeCity$ = new BehaviorSubject<string>('no_definido');

  public data$ = new BehaviorSubject<any>({});
  public dumpData = false;

  constructor(
      private dsCtrl: SaludController,
    	private router: Router,
    	private route: ActivatedRoute,
      public dialog: MatDialog,

    ) { }

  ngOnInit() {
    let first = true;
    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);

    let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;
        this.initCurrentPage();
      }
    })
    this.unBindList.push(sscrp2);
  }

  private initCurrentPage(){
    this.query = new VigilanciaBrowse();
  }

  openSearchForm(){
    this.openBrowseEditor = !this.openBrowseEditor;
  }

  refreshSelection(query: VigilanciaBrowse){
    this.showData = false;
    this.showGraph = false;

    this.query = this.repasarQuery(query);

    if(query.searchAction == SEARCH || query.searchAction == SEARCH_NEXT){
      this.fetchSolicitudes(this.query, query.searchAction);

    }else if(query.searchAction === EXPORT){
      this.dsCtrl.exportAsisprevencionByQuery(this.query);

    }
  }
  
  updateCurrentAsistencia(e){
    this.showEditor = false;
    this.currentAsistencia = null;
    this.fetchSolicitudes(this.query, SEARCH);
  }

  mapRequest(act:string){
    if(act ==="map:show"){
      this.initMapToRender();

    }else if(act === "map:hide"){
      this.renderMap = false;
    }
  }

  vinculoSelected(personId: string){
    this.query = new VigilanciaBrowse();
    this.query.isVigilado = false;
    this.query.hasCovid = false;
    this.query.viewList = [];

    this.query.requirenteId = personId;

    this.fetchSolicitudes(this.query, SEARCH);
  }

  changeCity(type, value) {
    if(value === this.actualParameter) return;
    this.showGraph = false;
    setTimeout(()=> {

      this.actualParameter = value;
      this.changeCity$.next(value);
      this.showGraph = true;

    }, 400)


  }
  
  dumpUser(e, token: any){
    e.stopPropagation();
    e.preventDefault();

    let dumpList = this.asignacionReportList.filter(t => t.asignadoId === token.asignadoId);
    this.dumpData = true;

    this.data$.next(dumpList);

  }

  /************************/
  /*    Sol/Asistencia   */
  /**********************/
  private repasarQuery(query: VigilanciaBrowse): VigilanciaBrowse{
    if(!query){
      query = new VigilanciaBrowse();
      query['avance'] = 'emitido';

      this.query = query;
    }
    
    return AsistenciaHelper.cleanQueryToken(query, true);
  }


  private fetchSolicitudes(query: VigilanciaBrowse, action: string){
    this.showData = false;
    this.showGraph = false;
    this.renderGraph = false;
    this.showAsignacionUsuarios = false;
    this.dumpData = false;

    if(this.query && this.query.reporte === R_LLAMADOS){

      this.dsCtrl.fetchResultListFromAsistenciaByQuery<any>(query).subscribe(records => {
        if(records && records.length){
          let dateRecords = this._buildSumByDate(records);

          this.sortLlamados(dateRecords)

          this.dsCtrl.updateLlamadosTableData(dateRecords);
          this.tableActualColumns = LLAMADO_EPIDEMIO;
          this.showData = true;

        }

      })

    }else {
      
      this.dsCtrl.fetchAsistenciaByQuery(query).subscribe(list => {
        if(list && list.length > 0){
          this.asistenciasList = list;
          this.initTableData(this.asistenciasList);

        }else {
          this.asistenciasList = [];

          this.showData = false;

        }
      })
    }

  }

  private _buildSumByDate(records){
    let sumByDate = new Map();

    records.forEach(record => {
      let indexTx = record.fecha; 

      if(sumByDate.has(indexTx)){
        if(record.covid){
          sumByDate.get(indexTx).llamados_covid_qty += 1;
        }else {
          sumByDate.get(indexTx).llamados_nocovid_qty += 1;
        }

      }else{
        let token = {
              fets_llamado: record.fets_llamado,
              fecha: record.fecha,
              index: indexTx,
              llamados_covid_qty: 0,
              llamados_nocovid_qty: 0,
            }

          if(record.covid){
            token.llamados_covid_qty += 1;
          }else {
            token.llamados_nocovid_qty += 1;
          }

         sumByDate.set(indexTx, token);

      }
    })

    return Array.from(sumByDate, ( [name, value]) => (value)  )
  }


  private reviver(key, value) {
    if(typeof value === 'object' && value !== null) {
      if (value.dataType === 'Map') {
        return new Map(value.value);
      }
    }
    return value;
  }

  private initTableData(list: Asistencia[]){

    if(this.query && this.query.reporte === R_DOMICILIOS){
      this.dsCtrl.updateDomiciliosTableData(list);

    }else if(this.query && this.query.reporte === R_CONTACTOS){

    }else if(this.query && this.query.reporte === R_ASIGNACION){
      this.asignacionReportList = list;
      this.usersMapArray = this.groupByUsers(list);

    }else if(this.query && this.query.reporte === R_LLAMADOS){
      this.asignacionReportList = list;
      this.usersMapArray = this.groupByUsers(list);

    }else {

      this.sortProperly(list);
      this.dsCtrl.updateTableData();

    }

    if(this.query && this.query.reporte === R_LABORATORIO){
      this.tableActualColumns = LABORATORIO

    }else if(this.query && this.query.reporte === R_DOMICILIOS){
      this.tableActualColumns = DOMICILIO

    }else if(this.query && this.query.reporte === R_ASIGNACION){
      this.showAsignacionUsuarios = true;
      return;

    }else if(this.query && this.query.reporte === R_MANAGECONTACTOS){
      this.tableActualColumns = SEGUIMIENTO

    }else if(this.query && this.query.reporte === R_SINSEGUIMIENTO){
      this.tableActualColumns = SEGUIMIENTO

    }else if(this.query && this.query.reporte === R_CONTACTOS){
      this.tableActualColumns = LABORATORIO;
      this.showGraph = true;
      this.renderGraph = true;

    }else {
      this.tableActualColumns = LABORATORIO

    }

    this.showData = true;

  }

  private sortLlamados(records: Array<any>){

    records.sort((fel, sel)=> {

      if(fel.fets_llamado < sel.fets_llamado ) return -1;

      else if(fel.fets_llamado > sel.fets_llamado ) return 1;

      else{
        return 0;
      }


    });
  }

  private sortProperly(records: Asistencia[]){

    records.sort((fel: Asistencia, sel: Asistencia)=> {
      let fprio = (fel.sisaevent && fel.sisaevent.fets_reportado) || fel.fenotif_tsa || fel.fecomp_tsa;
      let sprio = (sel.sisaevent && sel.sisaevent.fets_reportado) || sel.fenotif_tsa || sel.fecomp_tsa;

      if(fprio < sprio ) return -1;

      else if(fprio > sprio ) return 1;

      else{
        return 0;
      }


    });
  }



  tableAction(action){ // listener de sol-table
    this.showEditor = false;

    let selection = this.dsCtrl.selectionModel;
    let selected = selection.selected as AsistenciaTable[];

    if(action === 'autorizar'){
      selected.forEach(t =>{
        this.dsCtrl.updateAvanceAsistencia('autorizado', t.asistenciaId);
      })
    }
    if(action === 'editar'){

      let eventToEdit = selected && selected.length && selected[0];

      if(eventToEdit){
        this.editData(eventToEdit.asistenciaId)

      }
    }

    if(action === 'asignar'){
      //let eventToEdit = selected && selected.length && selected[0];
      //c onsole.log('Table Action: [%s]', eventToEdit, eventToEdit.asistenciaId)
 
       let iterator$ = new Subject<boolean>();
       let index = 0;

       iterator$.subscribe((step: boolean)=>{
          if(index < selected.length){
            this.loadAsistenciaToEdit(selected[index].asistenciaId, iterator$, selected)
            index += 1;
          }
       })

       //showTime!!
       iterator$.next(true);
    }

  }


  private loadAsistenciaToEdit(asistenciaId, iterator$: Subject<boolean>, selected: AsistenciaTable[]){
      this.dsCtrl.fetchAsistenciaById(asistenciaId).then(asis =>{
        //c onsole.log('Fetched: [%s]', asis.ndoc)
        if(asis){
          this.openSeguimientoModal(asis, iterator$, selected)
        }

      })
  }

  private openSeguimientoModal(asistencia: Asistencia, iterator$: Subject<boolean>, selected: AsistenciaTable[]){
    if(!this.checkUserPermission(ROLE_ADMIN)){
      this.dsCtrl.openSnackBar('Acceso restringido', 'ACEPTAR');
      return;
    }

    const dialogRef = this.dialog.open(
      VigilanciaSeguimientoComponent,
      {
        width: '800px',
        data: {

          asistencia: asistencia,
          selected: selected

        }
      }
    );

    dialogRef.afterClosed().subscribe((res: UpdateAsistenciaEvent) => {
      // c onsole.log('dialog CLOSED')
      if(res && res.action !== UPDATE_MULTIPLE){
        setTimeout(()=> {
          iterator$.next(true);

        },200)        
      }else {
        //acaestoy
        this.refreshSelection(this.query);
      }

    });    
  }

  private checkUserPermission(role: string):boolean{
    return this.dsCtrl.isUserMemberOf(role);
  }

  private groupByUsers(list){
    let usersMap = new Map();
    list.forEach(t=> {
      let index = JSON.stringify(t['asignadoId'])
      if(usersMap.has(index)){

        this.acumUserToken(t, usersMap.get(index))

      }else{
        usersMap.set(index, this.initUserToken(t))

      }
    })

    this.usersMapArray = Array.from(usersMap.values())
    this.usersMapArray.sort((f, s) => {
      if(f.asignadoSlug < s.asignadoSlug) return -1;
      if(f.asignadoSlug > s.asignadoSlug) return 1;
      return 0;
    })

    return this.usersMapArray
  }

  private acumUserToken(data: any, token: any){
    token['qasignados'] +=     1;
    token['qcontactos'] +=     data['contactos'];

    if(data['isCovid'])         token['qcovid'] += 1;
    if(data['isHuerfano'])      token['qhuerfanos'] += 1;
    if(data['fase']=== 'fase0') token['qfase0'] += 1;
    if(data['fase']=== 'fase1') token['qfase1'] += 1;
    if(data['fase']=== 'fase2') token['qfase2'] += 1;

  }

  private initUserToken(data: any){
    let token = {}
    token['isAsignado'] =     data['isAsignado']
    token['asignadoId'] =     data['asignadoId']
    token['asignadoSlug'] =   data['asignadoSlug']

    token['qasignados'] =     1;
    token['qcontactos'] =     data['contactos'];

    token['qhuerfanos'] =     0;
    token['qcovid']     =     0;
    token['qfase0'] = 0;
    token['qfase1'] = 0;
    token['qfase2'] = 0;

    if(data['isCovid'])         token['qcovid'] += 1;
    if(data['isHuerfano'])      token['qhuerfanos'] += 1;
    if(data['fase']=== 'fase0') token['qfase0'] += 1;
    if(data['fase']=== 'fase1') token['qfase1'] += 1;
    if(data['fase']=== 'fase2') token['qfase2'] += 1;

    // let fase = data['fase'] || 'faseX'
    // token['fase'] =           data['fase']
    // token['hasEstrechos'] =   data['hasEstrechos']
    // token['isCasoIndice'] =   data['isCasoIndice']
    // token['isCovid'] =        data['isCovid']
    // token['isHuerfano'] =     data['isHuerfano']
    // token['contactos'] =      data['contactos']
    // token['asistenciaId'] =   data['asistenciaId']
    // token['asistenciaSlug'] = data['asistenciaSlug']
    // token['asistenciaNdoc'] = data['asistenciaNdoc']

    return token;
  }

  private editData(id: string){
    //let token = this.asistenciasList.find(t => t._id === id);

    this.dsCtrl.fetchAsistenciaById(id).then(asis =>{
      if(asis){

        if(asis){
          this.currentAsistencia = asis;

          setTimeout(() =>{
            this.showEditor = true;
          }, 300)
        }else {
          this.currentAsistencia = null
        }

      }
    });
  }

  private initMapToRender(){
    let listener$: Subject<AsistenciaSig[]> = this.dsCtrl.fetchMapDataFromAsis(this.asistenciasList);
    listener$.subscribe(tokens => {
      if(tokens && tokens.length){
        this.baseLatLng = {
          lat: tokens[0].lat,
          lng: tokens[0].lng
        }
        
        tokens[0].asistencia.requeridox.slug

        this.mapData = tokens;
        this.renderMap = true;

      }
    })    
  }

}

const LLAMADO_EPIDEMIO = [
          'select',
          'fecha',
          'llamados_covid_qty',
          'llamados_nocovid_qty',
]


const DOMICILIO = [
          'select',
          'ndoc',
          'username',
          'telefono',
          'nucleo',
          'qty',
          'city',
          'locacion',
          'street2',
]

const SEGUIMIENTO = [
          'select',
          'ndoc',
          'personSlug',
          'telefono',
          'edad',
          "qcontactos",
          "asignadoSlug",
          "fup_fe_inicio",
          'covidActualState',
          'mdiagnostico',
          'covidSintoma',
          'covidAvance',
          'covidTxt',
          'reportadoPor',
          'fe_reportado',
          'lab_laboratorio',
          'lab_fe_toma',
          'lab_estado'
]

const LABORATORIO = [
          'select',
          'ndoc',
          'personSlug',
          'telefono',
          'edad',
          'covidActualState',
          'mdiagnostico',
          'covidSintoma',
          'covidAvance',
          'covidTxt',
          'reportadoPor',
          'fe_reportado',
          'lab_laboratorio',
          'lab_fe_toma',
          'lab_estado'
]