import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ArrayDataSource } from '@angular/cdk/collections';

import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { CensoIndustrias, CensoListDataSource } from '../../../empresas/censo.model';
import { CensoIndustrialService } from '../censo-industrial.service';

@Component({
  selector: 'censo-industrial-grid',
  templateUrl: './censo-industrial-grid.component.html',
  styleUrls: ['./censo-industrial-grid.component.scss']
})
export class CensoIndustrialGridComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  public showGrid = false;
  // asistenciaList
  private censoList$: BehaviorSubject<CensoIndustrias[]> = new BehaviorSubject<CensoIndustrias[]>([]);

  //asisenciaDataSource
  public dataSource: ArrayDataSource<CensoIndustrias>;
  public itemsLength: number = 0;


  constructor(
    private censoService: CensoIndustrialService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.censoList$ = this.censoService.censoListSource$;
  }

  ngOnInit(): void {
    this.censoList$.subscribe(list => {
      this.itemsLength = list && list.length;
      this.showGrid = true;
    })

    this.dataSource = new CensoListDataSource(
      this.censoList$,
      this.paginator
    );
  }



  public editItem(item: CensoIndustrias) {
    console.log('Ready to navigate: [%s]', item._id)
    //this.router.navigate(['vista', 'censo2021', item._id], { relativeTo: this.route });

    //this.router.navigate(['editar', item._id], { relativeTo: this.route });
    //this.router.navigate(['/mab/empresas/gestion/censo2021/', item._id]);
  }



}


