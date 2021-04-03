import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

import { OcupacionHospitalaria, OcupacionHospitalariaTable, OcupacionHospitalariaBrowse, OcupacionHospitalariaEvent} from '../../locacion.model';
import { LocacionCreateComponent } from '../../locacion-data/locacion-create/locacion-create.component';

import { LocacionHelper } from '../../locacion.helper';
import { LocacionService } from '../../locacion.service';


@Component({
  selector: 'ocupacion-browse',
  templateUrl: './ocupacion-browse.component.html',
  styleUrls: ['./ocupacion-browse.component.scss']
})
export class OcupacionBrowseComponent implements OnInit {
  public ocupacionList$: Observable<OcupacionHospitalaria[]>;

  public showTable = false;



  constructor(
      private locSrv: LocacionService,
  ) { }

  ngOnInit(): void {
    this.loadTableData();

  }

  private loadTableData(){
    let query = this.locSrv.ocupacionHospitalariaSelector;
    this.locSrv.fetchOcupacionesByQuery(query).subscribe(data => {
      this.locSrv.updateOcupacionTableData()
      this.showTable = true;


    })

  }

  eventFromTable(e){
    console.log('EventFromTable Bubbled')
  }

  altaNuevoParte(){
    console.log('Alta nuevo parte de ocupación')
  }

}
