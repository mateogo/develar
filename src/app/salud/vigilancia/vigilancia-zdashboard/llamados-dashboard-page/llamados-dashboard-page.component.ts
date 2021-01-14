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

const SEGUIMIENTO = 'LLAMADOSEPIDEMIO';
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
  public showChart = false;
  public graphTitle = 'Frecuencia de seguimiento';
  public browseTitle = 'Epidemiología: Seguimiento de afectados/as'

  public fechasDataSet: Array<string> = [];
  public covidDataSet: Array<number> = [];
  public nocovidDataSet: Array<number> = [];

  public chartType = 'bar';
  public chartOptions: any = {};
  public chartLabels: any = {};


  public data$ = new BehaviorSubject<any>({});
  public dumpData = false;

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
    	this.fetchSolicitudes(this.query);

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






  /************************/
  /*    Sol/Asistencia   */
  /**********************/
  private fetchSolicitudes(query: any){
    this.showData = false;

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
