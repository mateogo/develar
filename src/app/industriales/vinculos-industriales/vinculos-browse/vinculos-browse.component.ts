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
    console.log('lookUpActive Censo - TO BEGIN')
    this.showData = false;


    this._userService.userEmitter.subscribe(user => {
      if(user && user._id){
        console.log('User encontrado: [%s] [%s]', user.username, user.isUsuarioWeb);
        this.empCtrl.fetchIndustriaFromUser(user).subscribe(industria =>{
          if(industria){
            this.currentIndustry = industria;

            //c onsole.log('fetchCompaniaVinculada [%o]', this.currentIndustry);

            this.showData = true;

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
            this.showData = false;
          }
        })


      }else {
        // todo
      }
    })

  }


  public navigateToIndustry(){
    console.log('navigate to industry')
    this.router.navigate(['/mab/empresas/editar/', this.currentIndustry._id]);

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
      // console.log('Volviendo del modal [res=%o]', res);
      if (res.data && res.data.token) {
        this.router.navigate(['editar', res.data.token._id], { relativeTo: this.route });
      }
    });
  }

  public navigateToDashboard(): void {
    this.router.navigate(['dashboard']);
  }
}
