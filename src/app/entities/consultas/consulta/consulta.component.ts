import { Component, OnInit } from '@angular/core';
import { SharedService } from '../../../develar-commons/shared-service';
import { ConsultasService } from '../consultas.service';
import { ConsultaQuery } from '../consulta.model';

@Component({
  selector: 'app-consultas',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss'],
})
export class ConsultaComponent implements OnInit {
  public pageTitle = 'Gestión de consultas';
  public showData = false;

  constructor(
    private consultaService: ConsultasService,
    private sharedService: SharedService
  ) {
    this.sharedService.emitChange(this.pageTitle);
  }

  ngOnInit(): void {  }

  public fetchConsultas(query: ConsultaQuery): void {
    this.consultaService.fetchConsultasByQuery(query).subscribe(consultasList => {
      if (consultasList && consultasList.length > 0) {
        this.consultaService.updateTableData();
        this.showData = true;
      } else {
        this.showData = false;
      }
    });
  }
}
