import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VinculosAgregarFormComponent } from '../vinculos-agregar-form/vinculos-agregar-form.component';
import { UserWebService } from '../../../entities/user-web/user-web.service';

import { Subject, Observable } from 'rxjs';

import { ConsultasService } from '../../../entities/consultas/consultas.service';
import { UserService } from '../../../entities/user/user.service';
import { EmpresasController } from '../../../empresas/empresas.controller';
import { CensoIndustriasController } from '../../../empresas/censo.controller';

import { CensoIndustrias } from '../../../empresas/censo.model';
import { Consulta } from '../../../entities/consultas/consulta.model';
import { ConsultaHelper } from '../../../entities/consultas/consulta.helper';
import { Person } from '../../../entities/person/person';
import { User } from '../../../entities/user/user';



@Component({
  selector: 'app-vinculos-browse',
  templateUrl: './vinculos-browse.component.html',
  styleUrls: ['./vinculos-browse.component.scss']
})
export class VinculosBrowseComponent implements OnInit {

  public consultasList$: Observable<Consulta[]>;
  public censosList$: Observable<CensoIndustrias[]>;
  private activeCenso: CensoIndustrias;
  public currentIndustry: Person;

  public showData = false;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private empCtrl: EmpresasController,
    private censoCtrl: CensoIndustriasController,
    private _userService : UserService,
    private userWeb: UserWebService

    ) { }

  ngOnInit(): void {
    this.fetchCompaniaVinculada();
  }

  private fetchCompaniaVinculada(){
    this.showData = false;


    this._userService.userEmitter.subscribe((user: User) => {
      if(user && user._id){
        this.empCtrl.fetchIndustriaFromUser(user).subscribe(industria =>{
          if(industria){
            this.currentIndustry = industria;

            //c onsole.log('fetchCompaniaVinculada [%o]', this.currentIndustry);

            this.showData = true;

            this.censosList$ = this.censoCtrl.fetchActiveCensos$(this.currentIndustry._id)

            this.censosList$.subscribe(censos =>{
              if(censos && censos.length){
                this.activeCenso = censos[0];
                this.showData = true;
              }else {
                //marca this.showData = false;
                //this.empCtrl.openSnackBar('No ')
              }

            })

          }else{
            //c onsole.log('Industria no hallada, debe cargar una')
            //marca this.showData = false;
          }
        })


      }else {
        // todo
      }
    })

  }


  public navigateToIndustry(){
    this.router.navigate(['/dashboard/industrias/editar/', this.currentIndustry._id]);

  }

  public nuevoVinculo(): void {
    this.userWeb.fetchPersonByUserId(this._userService.currentUser._id).then(person => {
      this.openModalDialog(person);
    });
  }

  private openModalDialog(person: Person) {
    const dialogRef = this.dialog.open(
      VinculosAgregarFormComponent,
      {
        width: '800px',
        data: {
          person: person,
        }
      }
    );

    dialogRef.afterClosed().subscribe(res => {
      if (res.data && res.data.token) {
        this.router.navigate(['editar', res.data.token._id], { relativeTo: this.route });
      }
    });
  }

  public navigateToDashboard(): void {
    this.router.navigate(['dashboard']);
  }
}
