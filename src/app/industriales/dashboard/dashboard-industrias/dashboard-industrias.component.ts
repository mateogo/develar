import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable } from 'rxjs';

import { ConsultasService } from '../../../entities/consultas/consultas.service';
import { UserService } from '../../../entities/user/user.service';
import { EmpresasController } from '../../../empresas/empresas.controller';
import { CensoIndustriasController } from '../../../empresas/censo.controller';

import { CensoIndustrias } from '../../../empresas/censo.model';
import { Consulta } from '../../../entities/consultas/consulta.model';
import { ConsultaHelper } from '../../../entities/consultas/consulta.helper';
import { Person } from '../../../entities/person/person';
import { User } from '../../../entities/user/user'

@Component({
  selector: 'app-dashboard-industrias',
  templateUrl: './dashboard-industrias.component.html',
  styleUrls: ['./dashboard-industrias.component.scss']
})
export class DashboardIndustriasComponent implements OnInit {
  public industriasDashboardTitle = 'Empresa';
  public industriasDashboardSubtitle = 'Vincular la organización que represento';

  public consultasList$: Observable<Consulta[]>;
  public censosList$: Observable<CensoIndustrias[]>;
  private activeCenso: CensoIndustrias;
  public currentIndustry: Person;

  public showData = false;



  public industriasList = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private empCtrl: EmpresasController,
    private censoCtrl: CensoIndustriasController,
    private _userService : UserService

    ) { }

  ngOnInit(): void {
    this.fetchCompaniaVinculada()
  }

  private fetchCompaniaVinculada(){
    this.showData = false;


    this._userService.userEmitter.subscribe((user: User) => {
      if(user && user._id){
        this.empCtrl.fetchIndustriaFromUser(user).subscribe(industria =>{
          if(industria){
            this.currentIndustry = industria;
            this.showData = true;
 
          }else{
            this.showData = false;
          }
        })


      }else {
        // todo
      }
    })

  }



  public gotoIndustriasPage(): void {
    this.router.navigate(['industrias'], { relativeTo: this.route });
  }
}
