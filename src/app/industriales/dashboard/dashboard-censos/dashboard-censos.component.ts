import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Observable } from 'rxjs';

import { ConsultasService } from '../../../entities/consultas/consultas.service';
import { UserService } from '../../../entities/user/user.service';
import { EmpresasController } from '../../../empresas/empresas.controller';
import { CensoIndustriasController } from '../../../empresas/censo.controller';

import { CensoIndustrias } from '../../../empresas/censo.model';
import { Consulta } from '../../../entities/consultas/consulta.model';
import { ConsultaHelper } from '../../../entities/consultas/consulta.helper';
import { Person } from '../../../entities/person/person';


@Component({
  selector: 'app-dashboard-censos',
  templateUrl: './dashboard-censos.component.html',
  styleUrls: ['./dashboard-censos.component.scss']
})
export class DashboardCensosComponent implements OnInit {

  public consultasList$: Observable<Consulta[]>;
  public censosList$: Observable<CensoIndustrias[]>;
  private activeCenso: CensoIndustrias;
  private currentIndustry: Person;

  public showData = false;


  public title = 'Censo INDUSTRIAL';
  public subtitle = 'Censo 2020';
  
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _service: ConsultasService,
    private empCtrl: EmpresasController,
    private censoCtrl: CensoIndustriasController,
    private _userService : UserService
  ) { }

  ngOnInit(): void {
    console.log('************** dashboard censo ************')
    this.lookUpActiveCenso();

    
  }

  private lookUpActiveCenso(){
    console.log('lookUpActive Censo - TO BEGIN')

    this._userService.userEmitter.subscribe(user => {
      if(user && user._id){
        console.log('User encontrado: [%s] [%s]', user.username, user.isUsuarioWeb);
        this.empCtrl.fetchIndustriaFromUser(user).subscribe(industria =>{
          if(industria){
            this.currentIndustry = industria;

            this.censosList$ = this.censoCtrl.fetchActiveCensos$(this.currentIndustry._id)
            console.log('bingo! Industria encontrada [%s] [%s] [%s]', industria._id, industria.displayName, industria.ndoc)

            this.censosList$.subscribe(censos =>{
              console.log('Censo-subscribe [%s]', censos && censos.length)
              if(censos && censos.length){
                this.activeCenso = censos[0];
                this.showData = true;
              }else {
                this.showData = false;
                //this.empCtrl.openSnackBar('No ')
              }
        
            })
 
          }else{
            console.log('Industria no hallada, debe cargar una')
          }
        })


      }else {
        // todo
      }
    })

  }

  getLabel(key : string) {
    return ConsultaHelper.getOptionLabel('consultaType',key);
  }

  navigateBrowse(): void {
    this._router.navigate(['censos/panel'], { relativeTo: this._route });
  }

}
