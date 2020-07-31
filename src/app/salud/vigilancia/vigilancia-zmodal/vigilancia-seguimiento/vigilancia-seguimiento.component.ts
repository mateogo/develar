import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { devutils }from '../../../../develar-commons/utils';
import { PersonService } from '../../../person.service';

import { SaludController } from '../../../salud.controller';
import { Person, FamilyData, NucleoHabitacional, personModel, Address } from '../../../../entities/person/person';

import {   Asistencia, AfectadoFollowUp,UpdateAsistenciaEvent, AsistenciaTable,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';
const UPDATE = 'update';
const UPDATE_MULTIPLE = 'update_multiple';
const CANCEL = 'cancel';
const SEGUIMIENTO_ESTADO = 'seguimiento:estado';
const ASIGNAR_MSJ =    'APLICAR esta asignación a los contactos';
const DESASIGNAR_MSJ = 'QUITAR asignación a los contactos';

@Component({
  selector: 'vigilancia-seguimiento',
  templateUrl: './vigilancia-seguimiento.component.html',
  styleUrls: ['./vigilancia-seguimiento.component.scss']
})
export class VigilanciaSeguimientoComponent implements OnInit {

  public form: FormGroup;
  public formClosed = false;

  public asistencia: Asistencia;
  public seguimientoEvent: AfectadoFollowUp;

  public asignadoId: string;
  public asignadoSlug: string;
  public bajoTutelaDe: string;

  public tipoFollowUpOptList = AsistenciaHelper.getOptionlist('tipoFollowUp');
  public faseOptList =  AsistenciaHelper.getOptionlist('faseFollowUp');
  public displayAs = '';
  public contactoDe = '';
  private hasCasoIndice = false;
  public asigneeMsj = ''
  public showDumpData = false;

  private result: UpdateAsistenciaEvent;
  private isNewRecord = false;

  private selected: AsistenciaTable[];
  public hasMultipleSelected = false;
  public selectedCount = 0;
  private procesadosCount = 0;

  public usersOptList = [];
  public dumpData: any;

  constructor(
        public dialogRef: MatDialogRef<VigilanciaSeguimientoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private ctrl: SaludController,
        private perSrv: PersonService,
        private fb : FormBuilder) {
  }

  ngOnInit(): void {
  	this.asistencia = this.data.asistencia;
    this.selected = this.data.selected;

  	this.iniToken();
    this.initForEdit();
  }

  onSubmit(){
    this.formClosed = true;
    this.result.action = UPDATE;
  	this.initForSave()
  	this.saveToken();
  }


  onSubmitMultiple(){
    this.formClosed = true;
    this.result.action = UPDATE;
    this.initForSave()
    this.saveMultipleTokens();

  }

  onCancel(){
    this.result.action = CANCEL;
		this.dialogRef.close();
  }

  changeSelectionValue(type, val){
    if(type === 'asignadoId'){
      this.asignUserToFollowUp(val)
    }
  }

  propagateAsignee(){
    this.initForSave()
    this.assignFollowUpToContactList(this.asistencia);
  }

  private asignUserToFollowUp(val){
    this.asignadoId = val;
    this.asignadoSlug = this.usersOptList.find(t => t.val === val).label;
    this.form.get('isAsignado').setValue(true);
    this.asigneeMsj = ASIGNAR_MSJ;
 
  }


  changeAsignado(e: MatCheckboxChange){

    if(e.checked){
      let userId = this.form.get('asignadoId').value;
      if(userId){
        this.asignUserToFollowUp(userId);

      }else {
        this.asignadoId = null
        this.asignadoSlug = ''
        this.form.get('isAsignado').setValue(false);
        this.asigneeMsj = DESASIGNAR_MSJ;
       
      }
      // this.asignadoId = val;
      // this.asignadoSlug = this.usersOptList.find(t => t.val === val).label;

    }else {
      this.asignadoId = null
      this.asignadoSlug = ''
      this.asigneeMsj = DESASIGNAR_MSJ;

    }
  }

  private saveToken(){
    this.ctrl.manageEpidemioState(this.result).subscribe(asistencia =>{
    	if(asistencia){
    		this.result.token = asistencia;
    		this.ctrl.openSnackBar('Actualización exitosa', 'Cerrar');
    		this.closeDialogSuccess()
    	}else {
    		this.ctrl.openSnackBar('Se produjo un error al intentar guardar sus datos', 'ATENCIÓN');
    	}
    })
  }


  private async saveMultipleTokens(){
    this.procesadosCount = 0;
    let result = false;

    for(let tasis of this.selected){

      result = await this.processEachSelected(tasis.asistenciaId, tasis);
      if(result){
        this.procesadosCount += 1;
      }
    }
    this.ctrl.openSnackBar('ACTUALIZACIÓN exitosa de [' + this.procesadosCount + '] registros', 'CERRAR');

    let resultEvent = {
                    action: UPDATE_MULTIPLE,
                    type: SEGUIMIENTO_ESTADO,
                    token: this.asistencia
                  } as  UpdateAsistenciaEvent;

    this.closeDialogSuccess(resultEvent);


  }

  private processEachSelected(asistenciaId: string, tasis: AsistenciaTable){
    return new Promise<boolean>((resolve, reject) => {

        this.ctrl.fetchAsistenciaById(asistenciaId).then(asis =>{

          if(asis){
            this.applyAsignadoToAsistencia(asis, resolve)

          } else {
            this.ctrl.openSnackBar('ATENCIÓN: no se pudo recuperar la Asistencia de ' + tasis.ndoc, 'ACEPTAR');
            resolve(false);

          }

        })
    })

  }

  private applyAsignadoToAsistencia(asistencia: Asistencia, resolve ){
    let followUpToken = asistencia.followUp;
    if(followUpToken){

      followUpToken.isActive = true;

      if(!followUpToken.fe_inicio || !followUpToken.fets_inicio ){
        followUpToken.fe_inicio   = this.seguimientoEvent.fe_inicio || devutils.txFromDate(new Date());
        followUpToken.fets_inicio =  devutils.dateNumFromTx(followUpToken.fe_inicio);
      }

      followUpToken.tipo =         this.seguimientoEvent.tipo || 'sospecha';
      followUpToken.isAsignado =   this.seguimientoEvent.isAsignado;
      followUpToken.asignadoId =   this.seguimientoEvent.asignadoId;
      followUpToken.asignadoSlug = this.seguimientoEvent.asignadoSlug;

    }else {
      followUpToken = new AfectadoFollowUp();
      followUpToken = {...followUpToken, ...this.seguimientoEvent};
      asistencia.followUp = followUpToken

    }

    let result = {
                    action: UPDATE,
                    type: SEGUIMIENTO_ESTADO,
                    token: asistencia
                  } as  UpdateAsistenciaEvent;

    this.ctrl.manageEpidemioState( result ).subscribe(asistencia =>{
      if(asistencia){
        this.iterateFamilyList(asistencia).then(sucess => {
          resolve(true);
        })
 
      }else {
        this.ctrl.openSnackBar('Se produjo un error al intentar guardar los datos de ' + result.token.ndoc , 'ATENCIÓN');
        resolve(false)
      }
    })

  }


  private assignFollowUpToContactList(asistencia: Asistencia){
    this.ctrl.manageEpidemioState(this.result).subscribe(asistencia =>{
      if(asistencia){
        this.asistencia = asistencia;
        this.result.token = asistencia;
        this.loadPerson(asistencia);
 
      }else {
        this.ctrl.openSnackBar('Se produjo un error al intentar guardar sus datos', 'ATENCIÓN');
        return;
      }
    })

  }

  private async loadPerson(token: Asistencia){
    this.showDumpData = false;


    let personId = token.requeridox && token.requeridox.id
    let vinculoPerson: Person;

    if(!personId){
      this.ctrl.openSnackBar('Error: solicitud de vigilancia sin identificación de Persona', 'ATENCIÓN')
      return;
    }

    let per = await this.perSrv.fetchPersonById(personId);

    if(per){
      let familyList = per.familiares;

      if(familyList && familyList.length) {

        await this.iterateVinculosFam(familyList, token, per);
      }

    }else {
      this.ctrl.openSnackBar('Error: no se pudo recuperar la Persona afectada', 'ATENCIÓN')
      return;
    }
  }

  private iterateFamilyList(token: Asistencia){
    return new Promise((resolve, reject) => {
      this.loadPersonPromise(token, resolve);

    })    
  }

  private async loadPersonPromise(token:Asistencia, resolve){
      this.showDumpData = false;
      let personId = token.requeridox && token.requeridox.id
      let vinculoPerson: Person;

      if(!personId){
        this.ctrl.openSnackBar('Error: solicitud de vigilancia sin identificación de Persona', 'ATENCIÓN')
        resolve(false);
        return;
      }

      let per = await this.perSrv.fetchPersonById(personId);

      if(per){
        let familyList = per.familiares;

        if(familyList && familyList.length) {

          await this.iterateVinculosFam(familyList, token, per, resolve);

        }else{
          resolve(true);
        }

      }else {
        this.ctrl.openSnackBar('Error: no se pudo recuperar la Persona afectada', 'ATENCIÓN')
        resolve(false);
        return;
      }    
  }



  private async iterateVinculosFam(vinculos: FamilyData[], asistencia:Asistencia, person: Person, resolve?){
    let resultArray = [];
    let promiseArray = [];

    for(let i = 0; i < vinculos.length; i++){
      let result = new UpdateResult();
      let token;

      token = await this.processVinculoFam(vinculos[i], asistencia, result);

      resultArray.push(result);
      promiseArray.push(token);
    }

    //this.ctrl.openSnackBar('Actualización exitosa', 'Cerrar');
    this.dumpData = resultArray;
    this.showDumpData = true;

    let promiseAll =  Promise.all(promiseArray);
    promiseAll.then(x => {
      resolve(true);
    })
  }

  private async processVinculoFam(vinculo: FamilyData, asistencia: Asistencia, result: UpdateResult){
    let vper: Person;
    let list: Asistencia[];
    let updated: Asistencia;
    result.contacto = vinculo.nombre + ' ' + vinculo.apellido;
    result.resultado = 'no procesada';

    if(vinculo.personId){

      vper = await this.perSrv.fetchPersonById(vinculo.personId);

      result.resultado = 'Sin vigilancia, no actualiza';
      list = await this.ctrl.fetchAsistenciaByPerson(vper).toPromise()

      if(list && list.length){
        let asis = list[0];
        updated = await this.updateAsistencia(asis, asistencia, result);
        return updated;

      }else {
        return updated;

      }

    }else{
      return vper;
    }

  }

  private async updateAsistencia(target: Asistencia, source: Asistencia, result: UpdateResult){
    let followUpToken = target.followUp || new AfectadoFollowUp();
    followUpToken.isActive = true;

    if(!followUpToken.fe_inicio || !followUpToken.fets_inicio ){
      followUpToken.fe_inicio = source.followUp.fe_inicio;
      followUpToken.fets_inicio =  followUpToken.fe_inicio ? devutils.dateNumFromTx(this.seguimientoEvent.fe_inicio) :  0;
    }

    followUpToken.tipo = followUpToken.tipo ? followUpToken.tipo  : 'sospecha';

    // if(!followUpToken.isAsignado) {
    //   followUpToken.isAsignado =   source.followUp.isAsignado;
    //   followUpToken.asignadoId =   source.followUp.asignadoId;
    //   followUpToken.asignadoSlug = source.followUp.asignadoSlug;
    // }

    followUpToken.isContacto =   source.followUp.isAsignado;
    followUpToken.derivadoId =   source.followUp.asignadoId;
    followUpToken.derivadoSlug = source.followUp.asignadoSlug;
    result.resultado = 'Actualizado!';

    return await this.ctrl.upsertAsistenciaToken(target, {followUp: followUpToken});
  }



  private initForSave(){
  	let today = new Date();

    this.seguimientoEvent = {...this.seguimientoEvent, ...this.form.value}

    if(this.seguimientoEvent.isActive){
      this.seguimientoEvent.asignadoSlug = this.asignadoSlug
      this.seguimientoEvent.asignadoId = this.asignadoId

    }else{
      this.seguimientoEvent.asignadoSlug = ''
      this.seguimientoEvent.asignadoId = null
    }

    this.seguimientoEvent.fets_inicio = this.seguimientoEvent.fe_inicio ? devutils.dateNumFromTx(this.seguimientoEvent.fe_inicio) :  today.getTime();

    this.asistencia.followUp = this.seguimientoEvent;

    this.result.token = this.asistencia;
    this.result.type = SEGUIMIENTO_ESTADO;
  }

  private iniToken(){
    this.usersOptList = this.ctrl.buildEncuestadoresOptList();

    if(this.selected && this.selected.length){
      this.hasMultipleSelected = true;
      this.selectedCount = this.selected.length;
    }

  	if(this.asistencia.followUp){
  		this.seguimientoEvent = this.asistencia.followUp;
  		this.isNewRecord = false;

  	}else{
  		this.seguimientoEvent = new AfectadoFollowUp();
  		this.isNewRecord = true;
  	}
    this.displayAs = this.asistencia.requeridox ? this.asistencia.requeridox.slug + ' ' + (this.asistencia.telefono || '') : '';

    if(this.asistencia.casoIndice && this.asistencia.casoIndice.parentId){
      this.hasCasoIndice = true;
      this.contactoDe = 'Contacto de: ' + (this.asistencia.casoIndice.slug || '');
    }else {
      this.hasCasoIndice = false;
      this.contactoDe = '';
    }

  	this.result = {
							  		action: UPDATE,
							  		type: SEGUIMIENTO_ESTADO,
							  		token: this.asistencia
  								} as  UpdateAsistenciaEvent;
  }

  private initForEdit(){
    this.formClosed = false;
    this.seguimientoEvent.altaVigilancia = this.seguimientoEvent.altaVigilancia || false;
    this.seguimientoEvent.altaAsistencia = this.seguimientoEvent.altaAsistencia || false;

    this.seguimientoEvent.isAsignado = this.seguimientoEvent.isAsignado || false;
    this.seguimientoEvent.asignadoId = this.seguimientoEvent.asignadoId || '';
    this.seguimientoEvent.asignadoSlug = this.seguimientoEvent.asignadoSlug || '';
    
    this.seguimientoEvent.fase = this.seguimientoEvent.fase || '';
    this.seguimientoEvent.isAsistido = this.seguimientoEvent.isAsistido || false;

    this.asignadoSlug = this.seguimientoEvent.asignadoSlug;
    this.asignadoId = this.seguimientoEvent.asignadoId;

    this.bajoTutelaDe = (this.seguimientoEvent.isContacto && this.seguimientoEvent.derivadoSlug)
                        ? 'Contacto asignado a: ' + this.seguimientoEvent.derivadoSlug
                        :( this.hasCasoIndice ? 'Sin responsable de seguimiento, en tanto contacto': '');




    this.asigneeMsj = this.seguimientoEvent.isAsignado ? ASIGNAR_MSJ : DESASIGNAR_MSJ;

    this.form = this.fb.group(this.seguimientoEvent);
  }


  private closeDialogSuccess(resultEnd? ){

    if(resultEnd)this.dialogRef.close(resultEnd);
    else this.dialogRef.close(this.result);
    
  }

}

class UpdateResult {
  contacto: string = '';
  resultado : string  = '';
}