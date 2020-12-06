import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../develar-commons/shared-service';

@Component({
  selector: 'app-censo-industrial',
  templateUrl: './censo-industrial.component.html',
  styleUrls: ['./censo-industrial.component.scss']
})
export class CensoIndustrialComponent implements OnInit {
  public showData = false;

  public pageTitle = 'Gestión de censos';


  constructor(
    private shared: SharedService,
    private censoService: CensoService,
  ) {
    this.shared.emitChange(this.pageTitle);
  }

  ngOnInit(): void { }


  public fetchCensos(query: TurnoQuery): void {
    this._turnoService.fetchTurnosByQuery(query).subscribe(turnosList => {
      if (turnosList && turnosList.length > 0) {
        this._turnoService.updateTableData();
        this.showData = true;
      } else {
        this.showData = false;
      }
    });
  }
}
