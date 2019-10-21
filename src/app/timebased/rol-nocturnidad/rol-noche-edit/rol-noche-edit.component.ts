import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, personModel } from '../../../entities/person/person';

import { RolNocturnidad, RolNocturnidadItem, UpdateRolEvent }    from '../../timebased.model';
import { TimebasedHelper }    from '../../timebased-helper';

import { devutils }from '../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';

@Component({
  selector: 'rol-noche-edit',
  templateUrl: './rol-noche-edit.component.html',
  styleUrls: ['./rol-noche-edit.component.scss']
})
export class RolNocheEditComponent implements OnInit {
	@Input() rolnocturnidad: RolNocturnidad;
	@Output() updateToken = new EventEmitter<UpdateRolEvent>();

  public agentesList: RolNocturnidadItem[] = [];

  public actionOptList =   TimebasedHelper.getOptionlist('actions');
  public sectorOptList =   TimebasedHelper.getOptionlist('sectores');
  public ciudadesOptList = TimebasedHelper.getOptionlist('ciudades');
  public vigenciaOptList = TimebasedHelper.getOptionlist('vigencia');
  public facetaSeguridad = {
    facetas:'seguridad'
  }
  
	public form: FormGroup;
  public itemForm: FormGroup;
  public notValidItemData = false;

  public showViewAlimento = false;
  public showEditAlimento = false;

  private formAction = "";
  private fireEvent: UpdateRolEvent;

  constructor(
  	private fb: FormBuilder,
  	) { 
  		this.form = this.buildForm();
      this.itemForm = this.buildItemForm(this.form);
	}



  ngOnInit() {
  	this.initForEdit(this.form, this.rolnocturnidad);

  }

  /********************/
  /* Form handling   */
  /******************/
  buildForm(): FormGroup{
    let form: FormGroup;

    form = this.fb.group({
      slug:        [null],
      ferol_txa:   [null, Validators.compose([Validators.required])],
      vigencia:    [null, Validators.compose([Validators.required])],
      description: [null],
      sector:      [null],
      action:      [null],
      fecomp:      [null],
    });

    return form;
  }

  buildItemForm(baseForm: FormGroup): FormGroup{
    let form: FormGroup;

    form = this.fb.group({
      item_dni:      [null],
      item_nombre:   [null],
      item_apellido: [null],
    });
    baseForm.setControl('itemform', form);
    return form;
  }

  addAgentesToForm(list: RolNocturnidadItem[], form: FormGroup){
    list = list || [];
    this.agentesList = list;

    let agentesFG = list.map(agente => this.fb.group(agente));
    let agentesFormArray = this.fb.array(agentesFG);

    form.setControl('enrolados', agentesFormArray);
    return form;
  }

  get itemform(): FormGroup{
    return this.form.get('itemform') as FormGroup;
  }

  get enrolados(): FormArray{
    return this.form.get('enrolados') as FormArray;
  }

  insertNewAgenteToList(p: Person){

    if(!this.checkIfAlreadyIncludedInList(p, this.agentesList)){
      this.notValidItemData = false;
      
      let ag = TimebasedHelper.buildRolNocturnidadItemFromPerson(p);
      let agFG = this.fb.group(ag);
      let formArray = this.form.get('enrolados') as FormArray;

      this.agentesList.push(ag);
      formArray.push(agFG);

    }else {
      this.notValidItemData = true;
    }
  }

  checkIfAlreadyIncludedInList(p:Person, list: RolNocturnidadItem[]): boolean{
    return list.find(t =>{ 
      if(t._id && t.idPerson){
        return p._id === t.idPerson;
      }else if(t.personDni === p.ndoc){
        return true;
      } else {
        return false;
      }
      
    }) ? true: false;
  }

  initForEdit(form: FormGroup, token: RolNocturnidad): FormGroup {
    form.reset({
      slug:        token.slug,
      description: token.description,
      ferol_txa:   token.ferol_txa,
      vigencia:    token.vigencia,
      action:      token.action,
      sector:      token.sector,
      fecomp:      token.fecomp_txa,
    });

    this.addAgentesToForm(token.agentes, form);

    if(token.avance !== 'emitido'){
      console.log('Invalidando campo Action');
      form.get('action').disable();
    }
    return form;
  }

  /********************/
  /* Template Events */
  /******************/
  onSubmit(){
    this.initForSave(this.form, this.rolnocturnidad);
    this.formAction = UPDATE;
    this.emitEvent(this.formAction);
  }

  onCancel(){
    this.formAction = CANCEL;
    this.emitEvent(this.formAction);
  }

  deleteToken(){
    this.formAction = DELETE;
    this.emitEvent(this.formAction);
  }

  addPersonToList(e){
    if(!this.validItemData(this.itemForm)){
      this.notValidItemData = true
      return;
    }
    console.log('addPersonToList');

    let fvalue = this.itemForm.value;
    this.notValidItemData = false
    let person = new Person(fvalue.item_apellido + ', ' + fvalue.item_nombre, '', null, 'DNI', fvalue.item_dni);
    person.nombre = fvalue.item_nombre;
    person.apellido = fvalue.item_apellido
    this.insertNewAgenteToList(person);
    this.itemForm.reset();
  }

  private validItemData(form: FormGroup){
    let fvalue = this.itemForm.value;
    return  (fvalue.item_dni && fvalue.item_apellido && fvalue.item_nombre ) ? true : false;
  }

  handlePerson(p: Person){
    console.log('handlePerson: [%s] [%s] [%s]', p.nombre, p.apellido, p._id)
    this.insertNewAgenteToList(p);
  }

  changeSelectionValue(type, val){
    //console.log('Change [%s] nuevo valor: [%s]', type, val);
  }
 
  removeItem(e, index: number, item: FormGroup){
    e.preventDefault();
    console.log('removeItem... index:[%s]  id:[%s]', index, item.value._id);
    let formArray = this.form.get('enrolados') as FormArray;
    formArray.removeAt(index);
    this.agentesList.splice(index, 1);
  }

  /********************/
  /* Saving          */
  /******************/
	private initForSave(form: FormGroup, token: RolNocturnidad): RolNocturnidad {
		const fvalue = form.value;
		const entity = token;
    entity.ferol_txa =    fvalue.ferol_txa;
    entity.vigencia =     fvalue.vigencia;

		entity.slug =         fvalue.slug;
		entity.description =  fvalue.description;
		entity.action =       fvalue.action;
    entity.sector =       fvalue.sector;
		entity.fecomp_txa =   fvalue.fecomp;

		entity.estado = entity.estado || 'activo';
		return entity;
	}

  private emitEvent(action:string){
    this.updateToken.next({
      action: action,
      type: TOKEN_TYPE,
      selected: true,
      token: this.rolnocturnidad
    });
  }


}
