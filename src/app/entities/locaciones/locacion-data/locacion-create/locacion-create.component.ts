import { Component, Inject, OnInit, Input, Output,EventEmitter,TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { LocacionHospitalaria, LocacionEvent} from '../../locacion.model';

import { LocacionHelper }  from '../../locacion.helper';
import { LocacionService } from '../../locacion.service';
import { devutils }        from '../../../../develar-commons/utils'

const TOKEN_TYPE = 'locacionhospitalaria';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';
const CREATE = 'create';

export interface DialogActionData{
  action: string;
  label:  string;
  value?: any;
}

export interface DialogData {
  caption:string;
  title: string;
  body: string;
  accept: DialogActionData;
  cancel:DialogActionData;
  input: DialogActionData;
  itemplate?: TemplateRef<any>;
}


@Component({
  selector: 'locacion-create',
  templateUrl: './locacion-create.component.html',
  styleUrls: ['./locacion-create.component.scss']
})
export class LocacionCreateComponent implements OnInit {
	@Input() locacion: LocacionHospitalaria = new LocacionHospitalaria();
	//@Output() updateToken  = new EventEmitter<LocacionEvent>();

  public hospitalOL =  LocacionHelper.getOptionlist('hospital')
  public pageTitle = 'Alta rápida de locación de internación'
  
	public form: FormGroup;

	private action: string;

  constructor(
    public dialogRef: MatDialogRef<LocacionCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  	private fb: FormBuilder,
    private srv: LocacionService
  	) { 
  		this.form = this.buildForm();
	}


  onNoClick(): void {
    this.dialogRef.close();
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
        this.action = CREATE;
        this.emitEvent(this.action);

      }else{
        // todo
      }
    })

  }


  private emitEvent(action:string){
    this.dialogRef.close(this.action);

  	// let updateEvent: LocacionEvent = {
  	// 	action: action,
  	// 	type: TOKEN_TYPE,
  	// 	token: this.locacion
  	// }

  	// if(this.action === UPDATE){
	  // 	//this.updateToken.next(updateEvent);

  	// } else {

  	// }
  }

  changeSelectionValue(type, val){
    //console.log('Change [%s] nuevo valor: [%s]', type, val);
  }
 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
			code:        [null, Validators.compose([Validators.required])],
			slug:        [null, Validators.compose([Validators.required])],
			description: [null],
			type:        [null, Validators.compose([Validators.required])],
    });

    return form;
  }

  initForEdit(form: FormGroup, token: LocacionHospitalaria): FormGroup {
		form.reset({
			slug:        token.slug,
			description: token.description,
			type:        token.type,
			code:        token.code,
		});

		return form;
  }

	initForSave(form: FormGroup, token: LocacionHospitalaria): LocacionHospitalaria {
		const fvalue = form.value;
		const entity = token;

		entity.slug =         fvalue.slug;
		entity.description =  fvalue.description;
		entity.type =         fvalue.type;
		entity.code =         fvalue.code;

		entity.estado = 'activo';

		return entity;
	}

}
