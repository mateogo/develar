import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../develar-commons/shared-service';
import { CensoIndustriasQuery } from '../censo.model';
import { CensoIndustrialService } from '../censo-industrial.service';

@Component({
  selector: 'app-censo-industrial',
  templateUrl: './censo-industrial.component.html',
  styleUrls: ['./censo-industrial.component.scss']
})
export class CensoIndustrialComponent implements OnInit {
  public showData = false;
  public title = 'Censo Empresarial';

  public pageTitle = 'Gestión de censos';


  constructor(
    private shared: SharedService,
    private censoService: CensoIndustrialService,
  ) {
    this.shared.emitChange(this.pageTitle);
  }

  ngOnInit(): void { }


  public fetchCensos(query: CensoIndustriasQuery): void {
    this.censoService.fetchCensosIndustrialesByQuery(query).subscribe(turnosList => {
      if (turnosList && turnosList.length > 0) {
        this.censoService.updateTableData();
        this.showData = true;
      } else {
        this.showData = false;
      }
    });
  }
}
