import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { InternacionService } from '../../../salud/internacion/internacion.service';
import { SolInternacionTable } from '../../../salud/internacion/internacion.model';
import { map } from 'rxjs/operators';
import { ArrayDataSource } from '@angular/cdk/collections';



  const UPDATE =     'update';
  const EVOLUCION =  'evolucion';
  const DELETE =     'delete';
  const TOKEN_TYPE = 'asistencia';
  const NAVIGATE =   'navigate';
  const PANEL_TYPE = 'internacionList'; // [solcovid|offline]

  @Component({
    selector: "internacion-dashboard-list",
    templateUrl: "./internacion-dashboard-list.component.html",
    styleUrls: ["./internacion-dashboard-list.component.scss"],
  })
  export class InternacionDashboardListComponent implements OnInit{

    @Input() panelType = PANEL_TYPE;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  
    public title = 'Solicitudes de INTERNACIÓN';
  
    public showONE = false;
    public showTWO = false;
    public itemsLength: number = 0;
    public internacionesList : SolInternacionTable[] = [];
    private internacionesList$: BehaviorSubject<SolInternacionTable[]>
    internacionDataSource : ArrayDataSource<SolInternacionTable>;
    public viewCard : boolean = false;

    constructor(
        private dsCtrl: InternacionService,
      ) { 
      this.internacionesList$ = this.dsCtrl.internacionesDataSource;
      console.log("Inicia el constructor component list..")
    }
  
    ngOnInit() {
  
  
      this.internacionDataSource = new InternacionDataSource(this.internacionesList$, this.paginator);
  
      setTimeout(()=> {
        this.internacionDataSource.connect().subscribe(list => {
          this.internacionesList = list as SolInternacionTable[];
          console.log("Lista de internaciones a mostrar --> %o",this.internacionesList)
          
          if(this.internacionesList !== undefined){
            this.viewCard = true;
          }
        })
  
  
      }, 1500);
  
    }
  
   /* updateItem(event: UpdateAsistenciaEvent){
          this.emitEvent(event);
    }
  
    updateToken(event: UpdateAsistenciaEvent){
      this.updateAsistencia.next(event)
    }
  
  
    emitEvent(event:UpdateAsistenciaEvent){
    
      if(event.action === UPDATE){
        this.updateItems.next({
        action: UPDATE,
        type: TOKEN_TYPE,
        items: this.items
        });
      } else if(event.action === EVOLUCION){
        this.updateItems.next({
        action: EVOLUCION,
        type: TOKEN_TYPE,
        items: this.items
        });
  
      } else if(event.action === NAVIGATE){
        this.updateItems.next({
        action: NAVIGATE,
        type: TOKEN_TYPE,
        items: this.items
        });
  
      }
    }*/
  }
  export class InternacionDataSource extends ArrayDataSource<SolInternacionTable> {

    constructor(private sourceData: BehaviorSubject<SolInternacionTable[]>,
                private _paginator: MatPaginator){
      super(sourceData);
    }
  
    connect(): Observable<SolInternacionTable[]> {
  
      const displayDataChanges = [
        this.sourceData,
        this._paginator.page
      ];
  
      return merge(...displayDataChanges).pipe(
          map(() => {
            const data = this.sourceData.value.slice()
  
            const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
            return data.splice(startIndex, this._paginator.pageSize);
          })
       );
    }
  
    disconnect() {}
  
  }