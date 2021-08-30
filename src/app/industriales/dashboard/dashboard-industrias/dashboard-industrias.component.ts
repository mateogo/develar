import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Observable, from } from 'rxjs';
import { take, pluck, map } from 'rxjs/operators';

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
  public industriasDashboardTitle = 'Empresas';
  public industriasDashboardSubtitle = 'Acceda a esta sección para gestionar sus empresas vinculadas';

  public consultasList$: Observable<Consulta[]>;
  public censosList$: Observable<CensoIndustrias[]>;
  private activeCenso: CensoIndustrias;
  public currentIndustry: Person;
  public relatedIndustries: Person[] = [];

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
        this.empCtrl.fetchAllIndustriesIntegratedByUser(user).subscribe(industrias =>{
          if(industrias && industrias.length){
            this.relatedIndustries = industrias;
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

  loadCenso(industria: Person){
    this.censoCtrl.currentIndustry = industria;
    this.censoCtrl.currentCenso = null;

    this.censoCtrl.fetchActiveCensos$(industria._id).subscribe(censos => {

      if(censos && censos.length){
        let censoId = censos[0]._id
        this.censoCtrl.fetchCensoById(censoId).subscribe(censo =>{
          if(censo){
            this.gotoCensoById(censoId);
    
          }else{
            // esto es un error
            console.error('censo no encontrado')
          }
        });

      }else {

        this.gotoCensoNuevo();
      }

    })

  }
  
  //http://develar-local.co:4200/censo2021/5fc9ab369002ac35d6f10daa
  // public fetchCensoActivo$(industria: Person){
  //   return this.censoCtrl.fetchActiveCensos$(industria._id).pipe( 
  //       map(list => list && list.length && list[0].compNum) 
  //     );
  // }

  public gotoCensoById(censoId: string){
    this.router.navigate(['/dashboard/censos/censo2021', censoId]);
  }

  public gotoCensoNuevo(){
    this.router.navigate(['/dashboard/censos/censo2021']);
  }

  public gotoIndustriasPage(): void {
    this.router.navigate(['industrias'], { relativeTo: this.route });
  }
}
