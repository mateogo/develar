import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Consulta, ConsultaQuery } from '../../../entities/consultas/consulta.model';
import { ConsultasService } from '../../../entities/consultas/consultas.service';
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
    private _route: ActivatedRoute
    
  ) { }

  ngOnInit(): void {
    this.initOnce();
  }


  private initOnce(){
    this._userService.userEmitter.subscribe( user => {
      if(user && user._id){
        let query = new ConsultaQuery();
        query.userId = user._id;
        this._service.fetchConsultasByQuery(query).subscribe(list => {
          if(list && list.length){
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
