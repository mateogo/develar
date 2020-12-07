import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { EmpresasController } from '../../empresas.controller';
import { GenericDialogComponent } from '../../../develar-commons/generic-dialog/generic-dialog.component';


import { Person, personModel } from '../../../entities/person/person';
import { devutils }from '../../../develar-commons/utils';

const TSOCIAL = 'tsocial';
const TALIMENTAR = 'talimentar';
const AUDITORIA = 'auditoria';

@Component({
  selector: 'company-browse',
  templateUrl: './company-browse.component.html',
  styleUrls: ['./company-browse.component.scss']
})
export class CompanyBrowseComponent implements OnInit {
  public unBindList = [];

  // template helper
  public title = "Secretaría de Producción - MAB";
  public subtitle = "Buscador de Empresas";

  public tDoc = "DNI";
  public nDoc = "";
  public displayName = "";
  public displayDoc = "";
  public displayAddress = "";
  public sectorLabel = "";
  public peso = 0;

  public currentPerson: Person;

  public personFound = false;
  public altaPersona = false;

  public hasRemitos = false;

  private token: string;

  public isAutenticated = false;

  // person data
  public pname;
  public alerta;
  public pdoc;
  public edad;
  public edadTxt;
  public ocupacion;
  public nacionalidad;
  public estado;
  public neducativo;
  public sexo;


  constructor(
  		private dsCtrl: EmpresasController,
    	private router: Router,
    	private route: ActivatedRoute,
      public dialogService: MatDialog

  	) { }

  ngOnInit() {
    let first = true;    
    this.token = this.route.snapshot.paramMap.get('id')

    let sscrp2 = this.dsCtrl.onReady.subscribe(readyToGo =>{

      if(readyToGo && first){
        first = false;

        this.initCurrentPage();

      }
    })
    this.unBindList.push(sscrp2);
  }


  initCurrentPage(){
    this.dsCtrl.actualRoute(this.router.routerState.snapshot.url, this.route.snapshot.url);
  }

  /*********************
   *  Template Events /
   ******************/

  personFetched(persons: Person[]){
    if(persons.length){
      this.currentPerson = persons[0];

      this.initPersonDataForDisplay(this.currentPerson);
      this.navigateTo(this.currentPerson)

    }else{
      this.resetForm();
    }
  }

  private initPersonDataForDisplay(p: Person){
    if(!p) return;
    this.initPersonData(p);

    let edad = 0;

    edad = devutils.edadActual(new Date(p.fenac));
    
    this.displayDoc = personModel.getPersonDocum(p);
    this.displayAddress = personModel.displayAddress(p.locaciones);

    if(p.nombre || p.apellido){
      this.displayName = personModel.getPersonDisplayName(p) + ' (' + edad + ') '
    }


  }

  private initPersonData(person: Person){
    this.pname = personModel.getPersonDisplayName(person);
    this.alerta = person.alerta;
    this.pdoc = personModel.getPersonDocum(person);
    this.edad = devutils.edadActual(new Date(person.fenac));
    this.ocupacion = personModel.getProfesion(person.tprofesion)
    this.nacionalidad = personModel.getNacionalidad(person.nacionalidad)
    this.estado = personModel.getEstadoCivilLabel(person.ecivil);
    this.neducativo = personModel.getNivelEducativo(person.nestudios);
    this.sexo = person.sexo;

    if(person.fenac){
      this.edad = devutils.edadActual(new Date(person.fenac));
    }else{
      this.edad = 0
    }
    this.edadTxt = this.edad ? '(' + this.edad + ')' : '';




  }


  private resetForm(){
      this.altaPersona = false;
      this.personFound = false;
      this.sectorLabel = "";

  }

  private closeTurnosForm(){
    this.personFound = true;
    this.altaPersona = false;
  }

  private openTurnosForm(){
    this.personFound = true;
    this.altaPersona = false;
  
  }

  navigateTo(person: Person){
    this.router.navigate(['../editar',  person._id], {relativeTo: this.route});
  }

  openDialog(config) {
    let dialogRef = this.dialogService.open(GenericDialogComponent, config);
    return dialogRef.afterClosed()
  }

  buildWarningMessage(name){
    warningMessageTpl.data.body = name;
    return warningMessageTpl;
  }

  showWarning(){
    let content = this.buildWarningMessage('SECTOR de atención no seleccionado');
    this.openDialog(content).subscribe(result => {
      if(result === 'accept'){
        // Todo
      }
    });
  }

}

const warningMessageTpl = {
  width:  '330px',
  height: '300px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    caption:'Atención',
    body: 'La persona seleccionada es: ',
    accept:{
      action: 'accept',
      label: 'Aceptar'
    },
    cancel:{
      action: 'cancel',
      label: 'Cancelar'
    }
  }
};


