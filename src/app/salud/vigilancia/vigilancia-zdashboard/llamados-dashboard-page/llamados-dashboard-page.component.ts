import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { SaludController } from '../../../salud.controller';
import { ChartType} from 'chart.js';

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

const SEGUIMIENTO = 'LLAMADOSEPIDEMIO';
const INVESIGACIONESREALIZADAS = 'INVESTIGACIONESREALIZADAS';
const SEARCH = 'search';
const EXPORT = 'export';

@Component({
  selector: 'app-llamados-dashboard-page',
  templateUrl: './llamados-dashboard-page.component.html',
  styleUrls: ['./llamados-dashboard-page.component.scss']
})
export class LlamadosDashboardPageComponent implements OnInit, OnDestroy {
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
  public dumpData = true;

  public usersOptList: OptList[];
  public userTable: Array<UserFollowUp> = [];


  constructor(
      private dsCtrl: SaludController,
  	) { }


  ngOnInit(): void {
    this.usersOptList = this.dsCtrl.buildEncuestadoresOptList();

		this.query = new VigilanciaBrowse();
		this.query.reporte = SEGUIMIENTO;

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
    	this.fetchLlamadosSeguimiento(this.query);
    	this.fetchAuditEpidemio(this.query);

		}else if (query.searchAction === EXPORT){
			this.dsCtrl.exportSequimientosByQuery(this.query);

		}

  }

  tableAction(action){ 
    // TODO c onsole.log('table actions - todo')
  }


  private refreshView(query: VigilanciaBrowse){
    //this.showChart = false;
    this.showData = false;
    this.showChart = false;
    this.showDetalle = false;
    this.buildChartData(query);

    setTimeout(()=>{
      this.showData = true;
      this.showChart = true;

    },200)

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
        this.data$.next(this.sumAuditByUser);

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
		this.query.reporte = SEGUIMIENTO;

    this.dsCtrl.fetchResultListFromAsistenciaByQuery<any>(query).subscribe(records => {
      if(records && records.length){
 
        let sumByDate = this._buildSumByDate(records);
        this.userTable = this._buildSumByUser(records, this.usersOptList);

        let dateRecords = Array.from(sumByDate, ( [name, value]) => (value)  )
        this.sortLlamados(dateRecords)

        this.fechasDataSet =  dateRecords.map(value => value.fecha);
        this.covidDataSet =   dateRecords.map(value => value.llamados_covid_qty );
        this.nocovidDataSet = dateRecords.map(value => value.llamados_nocovid_qty );


        this.dsCtrl.updateLlamadosTableData(dateRecords);

        this.tableActualColumns = LLAMADO_EPIDEMIO;
        this.refreshView(query);

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
  isAsignado: boolean = false;
  userAsignadoInicial: string;

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