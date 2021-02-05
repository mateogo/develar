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
import { User } from '../../../entities/user/user'


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


  public title = 'Censo Empresarial 2021';
  public subtitle = 'Alta de la información provista por la Empresa';
  
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _service: ConsultasService,
    private empCtrl: EmpresasController,
    private censoCtrl: CensoIndustriasController,
    private _userService : UserService
  ) { }

  ngOnInit(): void {
    this.lookUpActiveCenso();
    
  }

  private lookUpActiveCenso(){

    this._userService.userEmitter.subscribe((user: User) => {
      if(user && user._id){
        this.empCtrl.fetchIndustriaFromUser(user).subscribe(industria =>{
          if(industria){
            this.currentIndustry = industria;

            this.censosList$ = this.censoCtrl.fetchActiveCensos$(this.currentIndustry._id)
 
            this.censosList$.subscribe(censos =>{
              if(censos && censos.length){
                this.activeCenso = censos[0];
                this.showData = true;
              }else {
                this.showData = false;
                //this.empCtrl.openSnackBar('INFO: No hay un CENSO activo','CERRAR')
                //this.empCtrl.openSnackBar('No ')
              }
        
            })
 
          }else{
            // c onsole.log('Industria no hallada, debe cargar una')
            //this.empCtrl.openSnackBar('Error: no fue posible recuperar la organización vinculada al usuario','ACEPTAR')
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
