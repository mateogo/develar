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

const ACTUAL_CENSO = "censo:empresarial:2021:01";

@Component({
  selector: 'app-censo-navigate',
  templateUrl: './censo-navigate.component.html',
  styleUrls: ['./censo-navigate.component.scss']
})
export class CensoNavigateComponent implements OnInit {
  public title = 'ALTA CENSO EMPRESARIAL 2021';
  public nuevoCensoTx = 'Iniciar nuevo CENSO';
  public showData = false;
  private hasOrganizacion = false;

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

  private lookUpActiveCenso(){
    this.showData = false;
    this.hasOrganizacion = false;

    this._userService.userEmitter.subscribe((user: User) => {
      if(user && user._id){

        this._empCtrl.fetchIndustriaFromUser(user).subscribe(industria =>{

          if(industria){
            this.hasOrganizacion = true;
            this.currentIndustry = industria;

            let query = {
              search: 'actual:censo',
              empresaId: this.currentIndustry._id,
              codigo: ACTUAL_CENSO
            }
        
            this._censoCtrl.fetchCensoByQuery(query).subscribe(list => {

              if(list && list.length){
                this._censoCtrl.updateTableData()
                this.showData = true;  
              }

            })
          }else{
            this.hasOrganizacion = false;
            this._censoCtrl.openSnackBar('ATENCIÓN: Debe vincular una organización para iniciar el censo', 'CERRAR')
          }

        })
            
      }else {
        // todo
      }
    })

  }


  nuevoCenso(): void {
    if(this.hasOrganizacion){
      //ToDo
      if(this.showData){
        this._censoCtrl.openSnackBar('ATENCIÓN: Ya ha iniciado el proceso de CENSO', 'CERRAR')

      }else {
        this._router.navigate(['../censo2021'], {relativeTo: this._route} );
      }

    }else{
      this._censoCtrl.openSnackBar('ATENCIÓN: Debe vincular una organización para iniciar el censo', 'CERRAR')
    }
  }

  navigateDashboard(): void {
    this._router.navigate(['dashboard']);
  }

  onCancelEvent(event : string){
    //c onsole.log(event)
  }


}
