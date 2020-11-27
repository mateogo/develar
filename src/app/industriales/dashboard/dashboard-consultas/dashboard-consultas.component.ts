import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConsultaHelper } from '../../../entities/consultas/consulta.helper';
import { Consulta } from '../../../entities/consultas/consulta.model';
import { ConsultasService } from '../../../entities/consultas/consultas.service';
import { UserWeb } from '../../../entities/user-web/user-web.model';

@Component({
  selector: 'dashboard-consultas',
  templateUrl: './dashboard-consultas.component.html',
  styleUrls: ['./dashboard-consultas.component.scss']
})
export class DashboardConsultasComponent implements OnInit {

  public user$: BehaviorSubject<UserWeb>; 
  public consultasList$: Observable<Consulta[]>;

  private user: UserWeb;

  public showData = false;


  public title = 'Consultas y Solicitudes';
  public subtitle = 'Solicitudes vigentes';
  
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _service: ConsultasService
  ) { }

  ngOnInit(): void {
    this.initOnce();
    
  }

  private initOnce(){
    this._service.user$.subscribe(user => {
      if(user && user._id){
        this.user = user;
        this.consultasList$ = this._service.fetchConsultaFromUser(this.user, {estado: 'activo'});        
        this.showData = true;

      }else {
        // todo
      }
    })


  }

  getLabel(key : string) {
    return ConsultaHelper.getOptionLabel('consultaType',key);
  }

  navigateBrowse(): void {
    this._router.navigate(['consultas'], { relativeTo: this._route });
  }

}
