import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from '../../../entities/user/user.service';

import { EmpresasController } from '../../empresas.controller';
import { CensoIndustriasController } from '../../censo.controller';
import { CensoIndustriasService, UpdateListEvent } from '../../censo-service';

import { CensoIndustrias, EstadoCenso, Empresa, CensoData } from '../../censo.model';

import { Person } from '../../../entities/person/person';
import { User } from '../../../entities/user/user';

const ACTUAL_CENSO = "censo:industrias:2020:00";

@Component({
  selector: 'app-censo-navigate',
  templateUrl: './censo-navigate.component.html',
  styleUrls: ['./censo-navigate.component.scss']
})
export class CensoNavigateComponent implements OnInit {
  public title = 'ALTA CENSO EMPRESARIAL 2021';
  public nuevoCensoTx = 'Iniciar nuevo CENSO';
  public showData = false;

  public censosList$: Observable<CensoIndustrias[]>;
  private currentIndustry: Person;
  

  
  constructor(
    private _empCtrl: EmpresasController,
    private _censoCtrl: CensoIndustriasController,
    private _userService : UserService,
    private _router: Router,
    private _route: ActivatedRoute
    
  ) { }

  ngOnInit(): void {
    this.lookUpActiveCenso()
  }


  // private initOnce(){
  //   this._userService.userEmitter.subscribe( user => {
  //     if(user && user._id){
  //       let query = new ConsultaQuery();
  //       query.userId = user._id;
  //       this._service.fetchConsultasByQuery(query).subscribe(list => {
  //         if(list && list.length){
  //           this._service.updateTableData();
  //           this.showData = true
  //         }
  //       })

  //     }else {
  //       // todo
  //     }
  //   })

  // }

  private lookUpActiveCenso(){
    this.showData = false;

    this._userService.userEmitter.subscribe((user: User) => {
      if(user && user._id){

        this._empCtrl.fetchIndustriaFromUser(user).subscribe(industria =>{

          if(industria){
            this.currentIndustry = industria;

            let query = {
              search: 'actual:censo',
              empresaId: this.currentIndustry._id,
              codigo: ACTUAL_CENSO
            }
        
            this._censoCtrl.fetchCensoByQuery(query).subscribe(list => {
              this._censoCtrl.updateTableData()
              this.showData = true;

            })
          }else{
            // todo
          }

        })
            
      }else {
        // todo
      }
    })

  }


  nuevoCenso(): void {
    this._router.navigate(['../censo2020'],{relativeTo: this._route});
  }

  navigateDashboard(): void {
    this._router.navigate(['dashboard']);
  }

  onCancelEvent(event : string){
    //c onsole.log(event)
  }


}
