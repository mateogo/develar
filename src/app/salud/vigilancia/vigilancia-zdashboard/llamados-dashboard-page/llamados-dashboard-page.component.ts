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

  constructor(
      private dsCtrl: SaludController,
  	) { }


  ngOnInit(): void {
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
    console.log('table actions - todo')
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
    this.data$.next(this.query)
    this.showData = false;

    this.dsCtrl.fetchResultListFromAsistenciaByQuery<any>(query).subscribe(records => {
      if(records && records.length){
        this.data$.next(records)

        let sumByDate = this._buildSumByDate(records);

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

  private _buildSumByDate(records){
    let sumByDate = new Map();

    records.forEach(record => {
      let indexTx = record.fecha; 

      if(sumByDate.has(indexTx)){
        if(record.covid){
          sumByDate.get(indexTx).llamados_covid_qty += record.qty;
        }else {
          sumByDate.get(indexTx).llamados_nocovid_qty += record.qty;
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
          token.llamados_covid_qty  = record.qty;
        }else {
          token.llamados_nocovid_qty = record.qty;
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

const LLAMADO_EPIDEMIO = [
          'select',
          'fecha',
          'llamados_covid_qty',
          'llamados_nocovid_qty',
]
