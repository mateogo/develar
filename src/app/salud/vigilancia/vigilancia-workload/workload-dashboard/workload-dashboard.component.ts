import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

import { SaludController } from '../../../salud.controller';
import { ChartType} from 'chart.js';
import { WorkLoadService } from '../work-load.service'

import { 	Asistencia, 
          AsistenciaTable,
          VigilanciaBrowse,
					Alimento,
          AsistenciaSig, 
					UpdateAsistenciaEvent, 
					UpdateAlimentoEvent, 
          UpdateAsistenciaListEvent,
          OptList,
					AsistenciaHelper } from '../../../asistencia/asistencia.model';
import { User } from '../../../../entities/user/user';

import {WorkLoad, AsistenciaFollowUp, UserWorkload, EventEmitted} from '../workload-helper';
import { devutils } from '../../../../develar-commons/utils';



const WORKLOADREPORT = 'WORKLOAD';
const INVESIGACIONESREALIZADAS = 'INVESTIGACIONESREALIZADAS';
const SEARCH = 'search';
const EXPORT = 'export';

const ACTION = 'user:detail';
const FILTER = 'asis:filter';
const TYPE = 'user:workload';

@Component({
  selector: 'workload-dashboard',
  templateUrl: './workload-dashboard.component.html',
  styleUrls: ['./workload-dashboard.component.scss'],
  providers: [ WorkLoadService ]
})
export class WorkloadDashboardComponent implements OnInit {
  public query: VigilanciaBrowse;
  public tableActualColumns: Array<string> = [];
  public showData =  false;
  public showDetalle = false;
  public showChart = false;
  public graphTitle = 'Frecuencia de seguimiento';
  public browseTitle = 'Epidemiología: Seguimiento de afectados/as'

  public fechasDataSet: Array<string> = [];
  public covidDataSet: Array<number> = [];
  public nocovidDataSet: Array<number> = [];

  public chartType = 'bar';
  public chartOptions: any = {};
  public chartLabels: any = {};

  public sumAuditByUser: Array<UserAudit> = [];
  public sumAuditConTel: Array<UserAudit> = [];
  public sumAuditSinTel: Array<UserAudit> = [];
  public detalleAudit:   Array<UserAudit> = [];


  public data$ = new BehaviorSubject<any>({});
  public dumpData = false;

  public usersOptList: OptList[];
  private userMap: Map<string, UserWorkload>;
  public userTable: Array<UserWorkload> = [];

  public asistencias: Array<AsistenciaFollowUp> = [];
  public asistencia$: BehaviorSubject<AsistenciaFollowUp[]> = new BehaviorSubject<AsistenciaFollowUp[]>([]);
  public user$: BehaviorSubject<UserWorkload> = new BehaviorSubject<UserWorkload>(new UserWorkload());

  public workLoad: any;


  constructor(
      private dsCtrl: SaludController,
      private service: WorkLoadService
  	) { }


  ngOnInit(): void {
    this.usersOptList = this.dsCtrl.buildEncuestadoresOptList();

		this.query = new VigilanciaBrowse();
		this.query.reporte = WORKLOADREPORT;

  }

  ngOnDestroy(): void {
  	delete this.query;
  }

  /************************/
  /*   TEMPLATE EVENTS   */
  /**********************/
  refreshSelection(query: VigilanciaBrowse){

    this.query = AsistenciaHelper.cleanQueryToken(query, false);

    if(query.searchAction === SEARCH){
    	this.fetchWorkLoad(this.query);
    	//this.fetchAuditEpidemio(this.query);

		}else if (query.searchAction === EXPORT){
			this.dsCtrl.exportSequimientosByQuery(this.query);

		}

  }

  viewUserDetail(event: EventEmitted){
    if(event.action === ACTION){
      console.log('event Bubbled: [%s]', event.token.asignadoId)
      this.openUserDetailView(event.token)
    }
    if(event.action === FILTER){
      console.log('event Bubbled FILTER: [%s]', event.token.asignadoId)
      this.filterAsistencias(event.token)
    }
  }

  private openUserDetailView(user: UserWorkload){
    let filteredAsis = this.filterAsistencias(user);
    
    this.service.openUserDialog(user, filteredAsis)

  }

  private filterAsistencias(user: UserWorkload): AsistenciaFollowUp[]{
    let filteredAsis = this.service.filterAsistencias(user, this.asistencias);

    this.asistencia$.next(filteredAsis);
    this.user$.next(user);
    return filteredAsis;

  }

  /**********************************/
  /*   workload WorkLoad WORKLOAD  */
  /********************************/

  public work_rows = ["casos", "telef", "inves", "covid", "altas", "otros"]
  public work_labels = ["Casos", "c/Telefono", "c/Investig", "COVID+", "ALTA", "OTROS"]
  public uniqueTS: Array<number>;
  public uniqueDates: Array<{fets:number, fetx:string}>;


  private fetchWorkLoad(query: any){
    this.service.fetchWorkloadByQuery<WorkLoad>(query).subscribe(workload => {
      this.userMap = new Map(workload.usuarios)
      this.userTable = Array.from(this.userMap.values());

      this.asistencias = workload.casos;
      this.asistencia$.next(this.asistencias);

      this.workLoad = this.buildWorkLoadTable(this.asistencias)

      this.showData = true;

    })

  }
  
  private buildWorkLoadTable(asistencias: AsistenciaFollowUp[]){
    this.uniqueTS = Array.from(new Set (asistencias.map(asis=> asis.fecomp_tsa))).sort((a, b)=> a-b);
    this.uniqueDates = this.uniqueTS.map(t => {return  {fets: t, fetx: devutils.txDayDateFromTime(t)}});
    this.workLoad = {
      casos: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      telef: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      inves: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      covid: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      altas: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      otros: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
    this.workLoad = asistencias.reduce((acum, asis)=> {
      let index = this.uniqueTS.indexOf(asis.fecomp_tsa);
      acum["casos"][index] += 1;
      acum["telef"][index] += asis.hasTelefono ? 1: 0;
      acum["inves"][index] += asis.hasInvestigacion ? 1: 0;
      acum["covid"][index] += asis.actualState === 1 ? 1: 0;
      acum["altas"][index] += asis.actualState === 5 ? 1: 0;
      acum["otros"][index] += (asis.actualState !== 1 && asis.actualState !== 5) ? 1: 0;
      return acum;

    }, this.workLoad);

    return this.workLoad;

  }

//  let a = ["1", "1", "2", "3", "3", "1"];
// let unique = a.filter((item, i, ar) => ar.indexOf(item) === i);
// console.log(unique);
  private dateArrayReduce(asistencias: AsistenciaFollowUp[]){
    let unique
    asistencias.reduce

  }





  tableAction(action){ 
    // TODO c onsole.log('table actions - todo')
  }


  private buildChartData(query?: VigilanciaBrowse){

    this.chartOptions = {
      responsive: true,

      legend: {
        position: 'top',
      },

      title: {
        display: true,
        text: 'Cantidad de llamados por día'
      },

      animation: {
        animateScale: true,
        animateRotate: true
      },

      tooltips: {
        callbacks: {
          label: function(item, data) {
                return data.datasets[item.datasetIndex].label+ ": "+ data.labels[item.index]+ ": "+ data.datasets[item.datasetIndex].data[item.index];
          }

        }
      }
    }
    this.showChart = true;

  }


  /*****************************************/
  /*   Informe INVESTIGACIONESREALIZADAS  */
  /***************************************/
  private fetchAuditEpidemio(query: any){
    this.showDetalle = false;
		this.query.reporte = INVESIGACIONESREALIZADAS;

    this.dsCtrl.fetchResultListFromAsistenciaByQuery<any>(query).subscribe(records => {

      if(records && records.length){
        this.detalleAudit = this._buildAuditByPerson(records as InvestigacionAudit[], this.usersOptList);
        //this.data$.next(this.sumAuditByUser);

        this.showDetalle = true;
      }

    })

  }


  // public sumAuditByUser: Array<UserAudit> = [];
  // public sumAuditConTel: Array<UserAudit> = [];
  // public sumAuditSinTel: Array<UserAudit> = [];
  // public detalleAudit:   Array<UserAudit> = [];
  private _buildAuditByPerson(records: Array<InvestigacionAudit>, userList: OptList[]){
    let users = [];
    let usersMap = new Map<string, UserAudit>();
    let detalleAuditMap = new Map();

    let auditSinTelToken = new UserAudit('audit_sin_tel');
    auditSinTelToken.personname = 'TOTAL INVESTIGACIONES SIN TELÉFONO'
    auditSinTelToken.hasTelefono = 1;
    let auditConTelToken = new UserAudit('audit_con_tel');
    auditConTelToken.personname = 'TOTAL INVESTIGACIONES CON TELÉFONO'
    auditConTelToken.hasTelefono = 2;

    userList.forEach(u =>{
      usersMap.set(JSON.stringify(u.val), new UserAudit('users', u.val, u.label));
    })
    let sin_user = new UserAudit('users', 'sin_usuario_investig', 'Sin investigación')
    usersMap.set(sin_user.userId, sin_user);
 
    records.forEach(token => {
      let index_user  = JSON.stringify(token.userId);
      let index_person  = this._buildAuditDetailIndex(token);

      if(detalleAuditMap.has(index_person)){
        //c onsole.log('Error: asistencia repetida: [%s] [%s]', token.ndoc, token.idPerson);

      }else {
        let auditToken = this._auditTokenFactory(token, index_person, auditSinTelToken, auditConTelToken, usersMap);
        detalleAuditMap.set(index_person, auditToken);
      }

    })
  
    let detailList = Array.from(detalleAuditMap.values());
    this.sortAudits(detailList);
    auditSinTelToken.username = auditSinTelToken.qinves_lograda + " / " + auditSinTelToken.qty;
    auditConTelToken.username = auditConTelToken.qinves_lograda + " / " + auditConTelToken.qty;
    detailList.unshift(auditSinTelToken)
    detailList.unshift(auditConTelToken)

    this.sumAuditByUser = Array.from(usersMap.values());
    this.sumAuditByUser = this.sumAuditByUser.filter(t => t.qty !== 0);

    return detailList;
  }

  private _buildAuditDetailIndex(token: InvestigacionAudit):string{
    return JSON.stringify(token.idPerson);
  }


  private _auditTokenFactory (record: InvestigacionAudit, index: string, acumSinTel:UserAudit, acumConTel:UserAudit, userMap:Map<string,UserAudit>): UserAudit{
    let audit = new UserAudit('detalle');
    // title: string = '';
    // username: string = '';
    // userId: string = '';
    // personname: string = '';
    // personId: string = '';
    // tdoc: string = '';
    // ndoc: string = '';
    // telefono: string = '';
    // isAsignado: boolean = false;
    // userAsignadoInicial: string;
    // index: string;
    // hasTelefono: number = 0; //  1: tiene telefono 2: no tiene teléfono
    // qty = 0;
    // qinves_lograda = 0;
    // qinves_sintel = 0;
    // qinves_contel = 0;
    // qllamados = 0;
    // qllamados_nc = 0;
    // qsintel = 0;
    // qconntel = 0;
    let hasTelefono = true;
    if(!record.telefono || record.telefono === 'sin dato') hasTelefono = false;
    if(record.llamados.qnotelefono > 0 && !record.llamados.qlogrado) hasTelefono = false;

    let hasInvestig = false;
    if(record.hasInvestigacion && record.userId ) hasInvestig = true;
    if(record.userInvestig && record.userId ) hasInvestig = true;

    if(record.userId){
      audit.userId = record.userId;
      audit.username = record.userInvestig;
    }

    audit.personname = record.personSlug;
    audit.fealta = record.fecomp_txa;
    audit.personId = record.idPerson;
    audit.tdoc = record.tdoc;
    audit.ndoc = record.ndoc;
    audit.telefono = record.telefono;

    audit.isAsignado = record.isAsignado;
    audit.asignadoId = record.asignadoId;
    audit.asignadoSlug = record.asignadoSlug;
  
    audit.userAsignadoInicial = record.userAsignado;
    audit.index = index;
    audit.hasTelefono = hasTelefono ? 1 : 2;
    audit.qty = 1;

    audit.hasInvestigacion = hasInvestig ? 2: 1;

    audit.qinves_lograda = hasInvestig ? 1 : 0;
    audit.qinves_sintel = (!hasInvestig && !hasTelefono) ? 1 : 0;
    audit.qinves_contel = (!hasInvestig &&  hasTelefono) ? 1 : 0;

    audit.qllamados = record.llamados.qlogrado;
    audit.qllamados_nc = record.llamados.qnocontesta;

    audit.qsintel =   hasTelefono ? 1 : 0;
    audit.qconntel = !hasTelefono ? 1 : 0;
    
    // ACUMULADORES
    if(hasTelefono){
      acumConTel.qty += 1;
      acumConTel.qinves_lograda += audit.qinves_lograda;
      acumConTel.qinves_sintel += audit.qinves_sintel;
      acumConTel.qinves_contel += audit.qinves_contel;
      acumConTel.qllamados += audit.qllamados;
      acumConTel.qllamados_nc += audit.qllamados_nc;
      acumConTel.qsintel += audit.qsintel;
      acumConTel.qconntel += audit.qconntel;
  
    }else {
      acumSinTel.qty += 1;
      acumSinTel.qinves_lograda += audit.qinves_lograda;
      acumSinTel.qinves_sintel += audit.qinves_sintel;
      acumSinTel.qinves_contel += audit.qinves_contel;
      acumSinTel.qllamados += audit.qllamados;
      acumSinTel.qllamados_nc += audit.qllamados_nc;
      acumSinTel.qsintel += audit.qsintel;
      acumSinTel.qconntel += audit.qconntel;

    }

    // ACUM BY USER

    let user_index  = record.userId ? JSON.stringify(record.userId) : record.userAsignado || 'sin_usuario_investig';

    if(!userMap.has(user_index)){
      let sin_user = new UserAudit('users', record.userAsignado,  record.userAsignado)
      userMap.set(sin_user.userId, sin_user);
    } 

    userMap.get(user_index).qty += 1;
    userMap.get(user_index).qinves_lograda += audit.qinves_lograda;
    userMap.get(user_index).qinves_sintel += audit.qinves_sintel;
    userMap.get(user_index).qinves_contel += audit.qinves_contel;
    userMap.get(user_index).qllamados += audit.qllamados;
    userMap.get(user_index).qllamados_nc += audit.qllamados_nc;
    userMap.get(user_index).qsintel += audit.qsintel;
    userMap.get(user_index).qconntel += audit.qconntel;


    return audit;
  }




  /********************************/
  /*   Llamado LLAMADOSEPIDEMIO  */
  /*****************************/
  private fetchLlamadosSeguimiento(query: any){
    this.showData = false;
    this.showChart= false;
		this.query.reporte = WORKLOADREPORT;

    this.dsCtrl.fetchResultListFromAsistenciaByQuery<any>(query).subscribe(records => {
      if(records && records.length){
 
        let sumByDate = this._buildSumByDate(records);
        //this.userTable = this._buildSumByUser(records, this.usersOptList);

        let dateRecords = Array.from(sumByDate, ( [name, value]) => (value)  )
        this.sortLlamados(dateRecords)

        this.fechasDataSet =  dateRecords.map(value => value.fecha);
        this.covidDataSet =   dateRecords.map(value => value.llamados_covid_qty );
        this.nocovidDataSet = dateRecords.map(value => value.llamados_nocovid_qty );


        this.dsCtrl.updateLlamadosTableData(dateRecords);

        this.tableActualColumns = LLAMADO_EPIDEMIO;
        this.buildChartData(query);
        this.showData = true;

      }
    })



  }

  private _buildSumByUser(records:Array<any>, userList: OptList[]): Array<UserFollowUp>{
    let sumByUserMap = new Map();
    let sumRows = new UserFollowUp('zrowtotals','Totales')

    userList.forEach(u =>{
      sumByUserMap.set(JSON.stringify(u.val), new UserFollowUp(u.val, u.label));
    })

    records.forEach(token => {
      let index  = JSON.stringify(token.userId);
      let dow  = (new Date(token.fets_llamado)).getDay();

      sumRows.qty += token.qty;
      sumRows.qty_dow[dow] += token.qty;
      sumRows.qcovid += token.qcovid;
      sumRows.qnocovid += token.qnocovid;
      sumRows.qlogrado += token.qlogrado;
      sumRows.qnocontesta += token.qnocontesta;
      sumRows.qnotelefono += token.qnotelefono;

      if(sumByUserMap.has(index)){
        sumByUserMap.get(index).qty += token.qty;
        sumByUserMap.get(index).qty_dow[dow] += token.qty;

        sumByUserMap.get(index).qcovid += token.qcovid;
        sumByUserMap.get(index).qnocovid += token.qnocovid;
        sumByUserMap.get(index).qlogrado += token.qlogrado;
        sumByUserMap.get(index).qnocontesta += token.qnocontesta;
        sumByUserMap.get(index).qnotelefono += token.qnotelefono;

      }else {
        let extra = new UserFollowUp(token.userId, token.username);
        extra.qty += token.qty;
        extra.qty_dow[dow] += token.qty;

        extra.qcovid += token.qcovid;
        extra.qnocovid += token.qnocovid;
        extra.qlogrado += token.qlogrado;
        extra.qnocontesta += token.qnocontesta;
        extra.qnotelefono += token.qnotelefono;

        sumByUserMap.set(index, extra);
      }
    });

    let sumByUserList = Array.from(sumByUserMap.values());
    sumByUserList = sumByUserList.filter(t => t.qty !== 0);
    sumByUserList.push(sumRows);

    return sumByUserList;

  }

  private _buildSumByDate(records){
    let sumByDate = new Map();

    records.forEach(record => {
      let indexTx = record.fecha; 

      if(sumByDate.has(indexTx)){
        sumByDate.get(indexTx).llamados_covid_qty += record.qcovid;
        sumByDate.get(indexTx).llamados_nocovid_qty += record.qnocovid;

      }else{
        let token = {
              fets_llamado: record.fets_llamado,
              fecha: record.fecha,
              index: indexTx,
              llamados_covid_qty: record.qcovid,
              llamados_nocovid_qty: record.qnocovid
            }

        
        sumByDate.set(indexTx, token);

      }
    })

    return sumByDate;
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

  private sortAudits(records: Array<UserAudit>){

    records.sort((fel, sel)=> {

      if(fel.hasTelefono < sel.hasTelefono ) return -1;
      else if(fel.hasTelefono > sel.hasTelefono ) return 1;
      else{

        if(fel.hasInvestigacion < sel.hasInvestigacion) return -1;
        else if(fel.hasInvestigacion > sel.hasInvestigacion) return 1;
        else {

          if(fel.personname < sel.personname) return -1;
          else if(fel.personname > sel.personname) return 1;
          else return 0;
  
        }



      }


    });
  }


}


class ChartData {
  type: ChartType = 'doughnut';
  dataset: any[] = [];
  labels: string[] = [];
  data : any[] = [];
  styles: any[] = [];
  opts: any ={};
  title: string = "";
  stitle: string = "";
  slug: string = "";
  error: string = "";

}

class UserFollowUp {
  username: string = '';
  userId: string = '';
  qty = 0;
  qcovid = 0;
  qnocovid = 0;
  qlogrado = 0;
  qnocontesta = 0;
  qnotelefono = 0;
  qty_dow = [0, 0, 0, 0, 0, 0, 0];
  constructor(uid, uname){
    this.userId = uid;
    this.username = uname;
  }
}

const LLAMADO_EPIDEMIO = [
          'select',
          'fecha',
          'llamados_covid_qty',
          'llamados_nocovid_qty',
]

class UserAudit {
  title: string = '';
  username: string = 'Sin dato';
  userId: string = '';
  personname: string = '';
  personId: string = '';
  fealta: string = ''
  tdoc: string = '';
  ndoc: string = '';
  telefono: string = '';
  userAsignadoInicial: string;

  isAsignado: boolean = false;
  asignadoId: string;
  asignadoSlug: string;

  index: string;
  hasTelefono: number = 0; // 2= no tiene teléfono 1: tiene telefono

  hasInvestigacion: number = 0;
  qty = 0;
  qinves_lograda = 0;
  qinves_sintel = 0;
  qinves_contel = 0;

  qllamados = 0;
  qllamados_nc = 0;

  qsintel = 0;
  qconntel = 0;

  constructor(title: string, userId?: string, username?: string){
    this.title = title;
    this.userId = userId ? userId : '';
    this.username = username ? username : 'Sin dato';
  }
}


class LlamadosToken {
  qlogrado: number;
  qnocontesta: number;
  qnotelefono: number;
}

class InvestigacionAudit {
  compNum: string;
  idPerson: string;
  personSlug: string;
  ndoc: string;
  tdoc: string;
  telefono: string;
  fecomp_txa: string;
  fecomp_tsa: number;
  covid: boolean;
  actualState: number;
  llamados: LlamadosToken;
  fe_investig: string;
  fets_investig: number;
  userInvestig: string;
  userAsignado: string;
  userId: string;
  hasInvestigacion: boolean;
  isAsignado: boolean;
  asignadoId: string;
  asignadoSlug: string;

}