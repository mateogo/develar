import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CensoIndustrialService } from '../censo-industrial.service';
import { CensoFeatureQuery, Condiciones, CondicionBusqueda, buscarEnOptList,tipoBusquedaOptList, CensoEmpresarialHelper} from '../censo-empresarial-helper';
import { CensoIndustrias } from '../../../empresas/censo.model';

@Component({
  selector: 'app-censo-empresarial-dashboard',
  templateUrl: './censo-empresarial-dashboard.component.html',
  styleUrls: ['./censo-empresarial-dashboard.component.scss']
})
export class CensoEmpresarialDashboardComponent implements OnInit {
  public query: CensoFeatureQuery;
  public searching = false;
  public showData = false;
  public censosEmitter$ = new BehaviorSubject<CensoIndustrias[]>([]);

  constructor(
    private censoService: CensoIndustrialService,

  ) { }

  ngOnInit(): void {
    this.initOnce();
  }

  private initOnce(){
    this.query = new CensoFeatureQuery();

  }

  public fetchCensos(query: CensoFeatureQuery): void {
    this.censoService.fetchCensosIndustrialesByQuery(query).subscribe(censos => {
      if (censos && censos.length > 0) {
        this.censoService.updateTableData();
        this.censoService.broadcastCensoList();
        this.censosEmitter$.next(censos)
        this.showData = true;
      } else {
        this.showData = false;
        this.censosEmitter$.next([])
      }
    });
  }


}
