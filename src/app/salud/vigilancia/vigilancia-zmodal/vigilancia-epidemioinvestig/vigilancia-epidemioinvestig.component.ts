import { Component, OnInit, Input, Output,EventEmitter, Inject } from '@angular/core';
import { FormBuilder, AbstractControl, ValidatorFn, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { SaludController } from '../../../salud.controller';
import { PersonService }   from '../../../person.service';

import { Person, personModel } from '../../../../entities/person/person';

import {  Asistencia,
          Requirente,
          ContextoCovid,
          ContextoDenuncia,
          InfectionFollowUp,
          Novedad, 
          Locacion,
          UpdateAsistenciaEvent, UpdateAlimentoEvent, AsistenciaHelper } from '../../../asistencia/asistencia.model';

import { devutils }from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'asistencia';
const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';
const EPIDEMIO = 'epidemio:investig';
const FIEBRE_TXT = [
              'Tuvo 38 o más grados de fiebre en los últimos 14 días',
              'Cree haber tenido fiebre en los últimos 14 días',
              'No tuvo fiebre en los últimos 14 días',
      ]

      
@Component({
  selector: 'vigilancia-epidemioinvestig',
  templateUrl: './vigilancia-epidemioinvestig.component.html',
  styleUrls: ['./vigilancia-epidemioinvestig.component.scss']
})
export class VigilanciaEpidemioinvestigComponent implements OnInit {
	// @Input() token: Asistencia;
  // @Input() usersOptList: Array<any> = [];
	// @Output() updateToken = new EventEmitter<UpdateAsistenciaEvent>();

  //public actualStateOptList = AsistenciaHelper.getOptionlist('estadoActualInfection');
  //public avanceOptList = AsistenciaHelper.getOptionlist('avance');
  //public estadoOptList = AsistenciaHelper.getOptionlist('estado');
  //public novedadOptList = AsistenciaHelper.getOptionlist('novedades');
  //public prioridadOptList = AsistenciaHelper.getOptionlist('prioridad');
  //public avanceCovidOptList = AsistenciaHelper.getOptionlist('avanceInfection')

  public sintomaOptList = AsistenciaHelper.getOptionlist('sintomaInfection');
  public tinternacionOptList = AsistenciaHelper.getOptionlist('tinternacion')
  public derivacionOptList = AsistenciaHelper.getOptionlist('derivacion')
  public trabajoOptList = AsistenciaHelper.getOptionlist('lugartrabajo')
  public usersOptList: Array<any> = [];

	public form: FormGroup;
  public formClosed = false;

  public asignadoInicial = "";
  public asistencia: Asistencia;

  private result: UpdateAsistenciaEvent;

  constructor(    
    public dialogRef: MatDialogRef<VigilanciaEpidemioinvestigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ctrl: SaludController,
    private fb : FormBuilder) {

  		  this.form = this.buildForm();
	}



  ngOnInit() {    
    this.usersOptList = this.ctrl.buildEncuestadoresOptList();
  	this.asistencia = this.data.asistencia
  	this.result = {
							  		action: UPDATE,
							  		type: EPIDEMIO,
							  		token: this.asistencia
  								} as  UpdateAsistenciaEvent;

    this.initForEdit(this.form, this.asistencia);
    
  }

  onSubmit(){
    this.formClosed = true;
    this.result.action = UPDATE;
  	this.initForSave(this.form, this.asistencia);
  	this.saveToken();
  }

  onCancel(){
    this.result.action = CANCEL;
		this.dialogRef.close();
  }

  changeSelectionValue(type, val){
    //c onsole.log('Change [%s] nuevo valor: [%s]', type, val);
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

  private closeDialogSuccess(){
    this.dialogRef.close(this.result);
  }




  private buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
			description: [null],

      fiebre:           [null],
      fiebreRB:         [null],

      hasDifRespiratoria: [null],
      hasDolorGarganta:   [null],
      hasTos:             [null],
      hasNeumonia:        [null],
      hasDolorCabeza:     [null],
      hasDiarrea:         [null],
      hasFaltaGusto:      [null],
      hasFaltaOlfato:     [null],
      sintomas:           [null],
      hasSintomas:        [null],
      fe_inicio:          [null],

      sintoma:            [null],
      fe_prevAlta:        [null],

      hasViaje:           [null],
      hasContacto:        [null],
      hasEntorno:         [null],

      hasDiabetes:        [null],
      hasHta:             [null],
      hasCardio:          [null],
      hasPulmonar:        [null],
      hasEmbarazo:        [null],
      hasCronica:         [null],
      hasFumador:         [null],
      hasObesidad:        [null],
      comorbilidad:       [null],

      isInternado:         [null],
      tinternacion:        [null],
      internacionSlug:     [null],

      derivacion:          [null],
      derivacionSlug:      [null],
      trabajo:             [null],
      trabajoSlug:         [null],


      hasTrabajoAdulMayores:  [null],
      hasTrabajoHogares:      [null],
      hasTrabajoPolicial:     [null],
      hasTrabajoHospitales:   [null],
      hasTrabajoSalud:        [null],
      contexto:               [null],


      fe_investig:        [null],
      userId:             [null, [Validators.required]],
      hasInvestigacion:   [null],

      //actualState:        [null],

    });

    return form;
  }

  private initForEdit(form: FormGroup, token: Asistencia): FormGroup {
    let sintomaCovid = token.sintomacovid || new ContextoCovid();
    let requirente = token.requeridox || new Requirente();


		form.reset({
			description: token.description,

      prioridad:   token.prioridad || 2,

      hasDifRespiratoria: sintomaCovid.hasDifRespiratoria,
      hasDolorGarganta:   sintomaCovid.hasDolorGarganta,
      hasFaltaGusto:      sintomaCovid.hasFaltaGusto,
      hasFaltaOlfato:     sintomaCovid.hasFaltaOlfato,
      hasTos:             sintomaCovid.hasTos,
      sintomas:           sintomaCovid.sintomas,

      hasNeumonia:       sintomaCovid.hasNeumonia,
      hasDolorCabeza:    sintomaCovid.hasDolorCabeza,
      hasDiarrea:        sintomaCovid.hasDiarrea,
      hasSintomas:       sintomaCovid.hasSintomas,
      fe_inicio:         sintomaCovid.fe_inicio,

      sintoma:            sintomaCovid.sintoma,
      fe_prevAlta:        sintomaCovid.fe_prevAlta,


      hasDiabetes:   sintomaCovid.hasDiabetes,
      hasHta:        sintomaCovid.hasHta,
      hasCardio:     sintomaCovid.hasCardio,
      hasPulmonar:   sintomaCovid.hasPulmonar,
      hasEmbarazo:   sintomaCovid.hasEmbarazo,
      hasCronica:    sintomaCovid.hasCronica,
      hasFumador:    sintomaCovid.hasFumador,
      hasObesidad:   sintomaCovid.hasObesidad,
      comorbilidad:  sintomaCovid.comorbilidad,


      isInternado:     sintomaCovid.isInternado,
      tinternacion:    sintomaCovid.tinternacion,
      internacionSlug: sintomaCovid.internacionSlug,


      derivacion:        sintomaCovid.derivacion, // de internación
      derivacionSlug:    sintomaCovid.derivacionSlug,

      trabajo:           sintomaCovid.trabajo,
      trabajoSlug:       sintomaCovid.trabajoSlug,

      hasViaje:          sintomaCovid.hasViaje,
      hasContacto:       sintomaCovid.hasContacto,
      hasEntorno:        sintomaCovid.hasEntorno,

      hasTrabajoAdulMayores:  sintomaCovid.hasTrabajoAdulMayores,
      hasTrabajoHogares:      sintomaCovid.hasTrabajoHogares,
      hasTrabajoPolicial:     sintomaCovid.hasTrabajoPolicial,
      hasTrabajoHospitales:   sintomaCovid.hasTrabajoHospitales,
      hasTrabajoSalud:        sintomaCovid.hasTrabajoSalud,

      contexto:           sintomaCovid.contexto,
      fe_investig:        sintomaCovid.fe_investig || devutils.txFromDate(new Date()),
      userId:             sintomaCovid.userId,
      hasInvestigacion:   sintomaCovid.hasInvestigacion,

      fiebre:             sintomaCovid.fiebre,
      fiebreRB:           sintomaCovid.fiebreRB,


    });

    this.asignadoInicial = sintomaCovid.userAsignado ? sintomaCovid.userAsignado : '';

		return form;
  }


	private initForSave(form: FormGroup, token: Asistencia): Asistencia {
		const fvalue = form.value;

		const entity = token;

		entity.description =  fvalue.description;
		entity.estado = entity.estado || 'activo';

    entity.sintomacovid = this.buildCovid(fvalue, entity);

		return entity;
	}

  private buildCovid(fvalue, entity: Asistencia): ContextoCovid{
    let covid = entity.sintomacovid || new ContextoCovid();
    let infeccion = entity.infeccion || new InfectionFollowUp()

    covid.hasFiebre = fvalue.fiebreRB !== 3;
    covid.fiebreTxt = this._leyendaFiebre(fvalue.fiebreRB);
    covid.fiebre =    fvalue.fiebre;
    covid.fiebreRB =  fvalue.fiebreRB;

    covid.hasDifRespiratoria = fvalue.hasDifRespiratoria;
    covid.hasDolorGarganta =   fvalue.hasDolorGarganta;
    covid.hasTos =             fvalue.hasTos;
    covid.hasFaltaGusto =      fvalue.hasFaltaGusto;
    covid.hasFaltaOlfato =     fvalue.hasFaltaOlfato;
    covid.sintomas =           fvalue.sintomas;

    covid.hasNeumonia =     fvalue.hasNeumonia;
    covid.hasDolorCabeza =  fvalue.hasDolorCabeza;
    covid.hasDiarrea =      fvalue.hasDiarrea;
    covid.hasSintomas =     fvalue.hasSintomas;
    covid.fe_inicio =       fvalue.fe_inicio;

    covid.sintoma =           fvalue.sintoma;
    covid.fe_prevAlta =       fvalue.fe_prevAlta;

    covid.hasDiabetes =       fvalue.hasDiabetes;
    covid.hasHta =            fvalue.hasHta;
    covid.hasCardio =         fvalue.hasCardio;
    covid.hasPulmonar =       fvalue.hasPulmonar;
    covid.hasEmbarazo =       fvalue.hasEmbarazo;
    covid.hasCronica =        fvalue.hasCronica;
    covid.hasFumador =        fvalue.hasFumador;
    covid.hasObesidad =       fvalue.hasObesidad;
    covid.comorbilidad =      fvalue.comorbilidad;
    covid.isInternado =       fvalue.isInternado;
    covid.tinternacion =      fvalue.tinternacion;
    covid.internacionSlug =   fvalue.internacionSlug;

    covid.derivacionSlug =    fvalue.derivacionSlug;
    covid.derivacion =        fvalue.derivacion;

    covid.trabajoSlug =       fvalue.trabajoSlug;
    covid.trabajo =           fvalue.trabajo;

    covid.hasViaje =           fvalue.hasViaje;
    covid.hasContacto =        fvalue.hasContacto;
    covid.hasEntorno =         fvalue.hasEntorno;
    covid.hasTrabajoAdulMayores =  fvalue.hasTrabajoAdulMayores;
    covid.hasTrabajoHogares =      fvalue.hasTrabajoHogares;
    covid.hasTrabajoPolicial =     fvalue.hasTrabajoPolicial;
    covid.hasTrabajoHospitales =   fvalue.hasTrabajoHospitales;
    covid.hasTrabajoSalud =        fvalue.hasTrabajoSalud;

    covid.contexto =               fvalue.contexto;

    // Tomo el valor pre-existente, no se edita acá
    covid.actualState = infeccion.actualState;

    covid.indicacion = covid.indicacion || 'Permanecer aislado controlando los síntomas';

    covid.fe_investig =         fvalue.fe_investig;
    covid.userId =              fvalue.userId;
    covid.hasInvestigacion =    fvalue.hasInvestigacion;
    if(covid.fe_investig){
      covid.fets_investig = devutils.dateNumFromTx(covid.fe_investig);
    }
    if(covid.userId){
      covid.userInvestig = this.usersOptList.find(t=>t.val === covid.userId).label;
    }

    return covid;
  }

  private _leyendaFiebre(valor): string{
    if(!valor || valor >3 || valor <1) valor = 3
    return FIEBRE_TXT[valor-1]
  }


}
