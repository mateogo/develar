import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl, ValidatorFn } from '@angular/forms';

import { LocacionHospitalaria, Servicio, Recurso, LocacionEvent} from '../../locacion.model';

import { LocacionHelper }  from '../../locacion.helper';
import { LocacionService } from '../../locacion.service';
import { devutils }        from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'locacionhospitalaria';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'locacion-edit',
  templateUrl: './locacion-edit.component.html',
  styleUrls: ['./locacion-edit.component.scss']
})
export class LocacionEditComponent implements OnInit {
	@Input() locacion: LocacionHospitalaria = new LocacionHospitalaria();
	@Output() updateToken  = new EventEmitter<LocacionEvent>();

  public pageTitle = 'Edición de locación de internación'

	public serviciosTitle = 'Capacidad disponible por Servicio';
  public recursosTitle =  'Despliegue de recursos disponibles'

  public hospitalOL =  LocacionHelper.getOptionlist('hospital')
  public serviciosOL=  LocacionHelper.getOptionlist('servicios')
  public recursosOL=  LocacionHelper.getOptionlist('recursos')
  
	public form: FormGroup;
  
	private action: string;

  constructor(
  	private fb: FormBuilder,
    private srv: LocacionService
  	) { 
  		this.form = this.buildForm();
	}

  ngOnInit() {
  	this.initForEdit(this.form, this.locacion);
  }

  onSubmit(){
  	this.initForSave(this.form, this.locacion);
    this.save(this.locacion);
  }

  onCancel(){
  	this.action = CANCEL;
  	this.emitEvent(this.action);
  }

  deleteToken(){
  	this.action = DELETE;
  	this.emitEvent(this.action);

  }


  private save(record: LocacionHospitalaria){
    this.srv.manageLocacionesRecord(record).subscribe(locacion => {
      if(locacion){
        this.locacion = locacion;
        this.action = UPDATE;
        this.emitEvent(this.action);

      }else{
        // todo
      }
    })

  }

  private emitEvent(action:string){

  	let updateEvent: LocacionEvent = {
  		action: action,
  		type: TOKEN_TYPE,
  		token: this.locacion
  	}

		this.updateToken.next(updateEvent);

  }

  changeSelectionValue(type, val){

  }
 
  private buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
			code:        [null, Validators.compose([Validators.required])],
			slug:        [null, Validators.compose([Validators.required])],
			description: [null],
			type:        [null, Validators.compose([Validators.required])],
    });

    return form;
  }

  private initForEdit(form: FormGroup, token: LocacionHospitalaria): FormGroup {

		form.reset({
			slug:        token.slug,
			description: token.description,
			type:        token.type,
			code:        token.code,
		});

    this.buildServicios(token.servicios)
    this.buildRecursos(token.recursos)

		return form;
  }

  private buildServicios(servicios: Servicio[]){
  	
  	if(!(servicios && servicios.length)){
    	servicios = LocacionHelper.initServiciosInternacion();
  	}

    let serviciosFG = servicios.map(servicio => this.fb.group(servicio))
    let serviciosFormArray = this.fb.array(serviciosFG);

    this.form.setControl('servicios', serviciosFormArray);
  }

  private buildRecursos(recursos: Recurso[]){
    recursos = recursos || [];
    
    let recursosFG = recursos.map(recurso => this.fb.group(recurso))
    let recursosFormArray = this.fb.array(recursosFG);

    this.form.setControl('recursos', recursosFormArray);
  }



  addNewServicioEvent(){
    let item = new Servicio();
    let servicioFG = this.fb.group(item);
    let formArray = this.form.get('servicios') as FormArray;

    formArray.push(servicioFG);
  }

  get servicios(): FormArray{
    return this.form.get('servicios') as FormArray;
  }


  // addNewRecursoEvent(){
  //   let item = new Recurso();
  //   let recursoFG = this.fb.group(item);
  //   let formArray = this.form.get('recursos') as FormArray;

  //   formArray.push(recursoFG);
  // }

  // initRecursoEvent(){
  //   this.initForSave(this.form, this.locacion)

  //   let recursos = LocacionHelper.initRecursosInternacion(this.locacion);
  //   this.locacion. recursos = recursos || [];

  //   this.initForEdit(this.form, this.locacion);

  //   // let recursosFG = recursos.map(recurso => this.fb.group(recurso))
  //   // let recursosFormArray = this.fb.array(recursosFG);

  //   // this.form.setControl('recursos', recursosFormArray);

  // }

  updateRecursoEvent(){
    this.initForSave(this.form, this.locacion)

    let recursos = LocacionHelper.updateRecursosInternacion(this.locacion);
    this.locacion. recursos = recursos || [];

    this.initForEdit(this.form, this.locacion);

    // let recursosFG = recursos.map(recurso => this.fb.group(recurso))
    // let recursosFormArray = this.fb.array(recursosFG);

    // this.form.setControl('recursos', recursosFormArray);

    //this.initForEdit(this.form, this.locacion);

  }

  actualizarRecursoEvent(){
    this.initForSave(this.form, this.locacion)

    let recursos = LocacionHelper.rebuildRecursosInternacionLabels(this.locacion);
    this.locacion. recursos = recursos || [];


    this.initForEdit(this.form, this.locacion);

  }


  
  get recursos(): FormArray{
    return this.form.get('recursos') as FormArray;
  }

  removeRecursoItem(e, item){
    e.preventDefault();
    this.removeItemFromList(item);
  }

  private removeItemFromList(item){
    let formArray = this.form.get('recursos') as FormArray;
    formArray.removeAt(item);
  }


	private initForSave(form: FormGroup, token: LocacionHospitalaria): LocacionHospitalaria {
		const fvalue = form.value;
		const entity = token;
    const servicios: Servicio[] = fvalue.servicios.map(t => Object.assign({}, t,  {srvIsActive: ((parseInt(t.srvQDisp, 10) + parseInt(t.srvQAdic,10)) > 0 ? true : false)}))

    const recursos: Recurso[] = fvalue.recursos.map(t => Object.assign({}, t));

		entity.slug =         fvalue.slug;
		entity.description =  fvalue.description;
		entity.type =         fvalue.type;
		entity.code =         fvalue.code;
		entity.estado = 'activo';

		entity.servicios = servicios || [];
    entity.recursos =  recursos || [];

		return entity;
	}

}
