import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { VinculosAgregarFormComponent } from '../vinculos-agregar-form/vinculos-agregar-form.component';
import { Observable } from 'rxjs';
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

  public title = 'Empresas representadas'
  public vincularTx = 'Vincular una empresa'
  public tooltipTx = 'Vincula a este perfil la organización que Usted representa por ser titular, socio, apoderado, o funcionario.'

  public showData = false;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private empCtrl: EmpresasController,
    private censoCtrl: CensoIndustriasController,
    private _userService : UserService

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
    if (false /*this.currentIndustry*/) {
      this.censoCtrl.openSnackBar('Usted ya posee una industria vinculada.', 'CERRAR');
     } else {
      this._userService.fetchPersonByUserId(this._userService.currentUser._id).then(person => {
        this.openModalDialog(person);
      });
     }
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
