import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Consulta, ConsultaQuery } from '../../../entities/consultas/consulta.model';
import { ConsultasService } from '../../../entities/consultas/consultas.service';
import { UserWeb } from '../../../entities/user-web/user-web.model';
import { UserWebService } from '../../../entities/user-web/user-web.service';
import { UserService } from '../../../entities/user/user.service';

@Component({
  selector: 'consultas-browse',
  templateUrl: './consultas-browse.component.html',
  styleUrls: ['./consultas-browse.component.scss']
})
export class ConsultasBrowseComponent implements OnInit {
  public consultasList$: Observable<Consulta[]>;

  public showData = false;

  constructor(
    private _service: ConsultasService,
    private _userService : UserService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _dialogService: MatDialog,
    
  ) { }

  ngOnInit(): void {
    this.initOnce();
  }


  private initOnce(){
    this._userService.userEmitter.subscribe( user => {
      console.log("user --> %o",user)
      if(user && user._id){
        console.log("Cumple condición de usuario")
        let query = new ConsultaQuery();
        query.userId = user._id;
        this._service.fetchConsultasByQuery(query).subscribe(list => {
          console.log("list --> %o",list)
          if(list && list.length){
            console.log("this.showData = true")
            this._service.updateTableData();
            this.showData = true
          }
        })

      }else {
        // todo
      }
    })
      


  }



  nuevaConsulta(): void {
    this._router.navigate(['alta'], { relativeTo: this._route });
  }

  navigateDashboard(): void {
    this._router.navigate(['dashboard']);
  }

  onCancelEvent(event : string){
    console.log(event)
  }

}
