import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { SisplanController } from '../../sisplan.controller';

import { Pcultural, PculturalHelper } from '../pcultural.model';

import { devutils }from '../../../develar-commons/utils'


const TOKEN_TYPE = 'pcultural';
const CANCEL = 'cancel';
const UPDATE = 'update';
const DELETE = 'delete';

@Component({
  selector: 'pcultural-create',
  templateUrl: './pcultural-create.component.html',
  styleUrls: ['./pcultural-create.component.scss']
})
export class PculturalCreateComponent implements OnInit {

  public sectorOptList =    PculturalHelper.getOptionlist('sector');
  public formatoOptList =   PculturalHelper.getOptionlist('formato');
  public programaOptList =  PculturalHelper.getOptionlist('programa');
  public publicoOptList =   PculturalHelper.getOptionlist('publico');

  public typeOptList =      PculturalHelper.getOptionlist('type');
  public stypeOptList =     [];
  public stypeOptMap =      PculturalHelper.getSubTypeMap();

  public sedeOptList =      PculturalHelper.getOptionlist('sede');
  public locacionOptList =  [];
  public locacionOptMap =   PculturalHelper.getLocacionMap();


	public form: FormGroup;

  private formAction = "";

  private pcultural: Pcultural = new Pcultural();


  constructor(
  	private fb:     FormBuilder,
    private dsCtrl: SisplanController,
    private route:  ActivatedRoute,
    private router: Router,
  	) { 
      this.form = this.buildForm();
	}



  ngOnInit() {
  	this.initForEdit(this.form, this.pcultural);

  }

  onSubmit(){
  	this.initForSave(this.form, this.pcultural);
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

  emitEvent(action:string){
    
    if(this.formAction === UPDATE){
      this.dsCtrl.managePCulturalRecord(this.pcultural).subscribe(token => {
        this.pcultural = token;
        this.navigateTo();
      })
    }


  }

  navigateTo(){
    this.router.navigate(['../', this.pcultural._id], {relativeTo: this.route});

  }


  changeSelectionValue(type, val){
    if(type === 'type'){
      this.stypeOptList = this.stypeOptMap[val] || [];

      if(this.stypeOptList.length === 1){
        this.form.get('stype').setValue(this.stypeOptList[0].val);

      }
    }

    if(type === 'sede'){
      this.locacionOptList = this.locacionOptMap[val] || [];

      if(this.locacionOptList.length === 1){
        this.form.get('stype').setValue(this.locacionOptList[0].val);

      }
    }

  }


 
  buildForm(): FormGroup{
  	let form: FormGroup;

    form = this.fb.group({
			slug:        [null, Validators.compose([Validators.required])],
      description: [null],

      programa:    [null, Validators.compose([Validators.required])],
      type:        [null, Validators.compose([Validators.required])],
      stype:       [null, Validators.compose([Validators.required])],

			publico:     [null],
			formato:     [null],

      sector:      [null, Validators.compose([Validators.required])],
			sede:        [null],
			locacion:    [null],


    });

    return form;
  }

  initForEdit(form: FormGroup, pcultural: Pcultural): FormGroup {
		form.reset({
			slug:        pcultural.slug,
      description: pcultural.description,

      programa:    pcultural.programa,
			type:        pcultural.type,
			stype:       pcultural.stype,

			formato:     pcultural.formato,
      publico:     pcultural.publico,

      sector:      pcultural.sector,
			sede:        pcultural.sede,
			locacion:    pcultural.locacion,

		});



    // this.actionOptList = this.sectorActionRelation[pcultural.sector] || [];
    // this.buildNovedades(pcultural.novedades)

		return form;
  }

 
	initForSave(form: FormGroup, pcultural: Pcultural): Pcultural {
		const fvalue = form.value;
		const entity = pcultural;

    entity.slug =  fvalue.slug;
		entity.description =  fvalue.description;

    entity.programa =       fvalue.programa;
    entity.type =       fvalue.type;
    entity.stype =       fvalue.stype;

    entity.formato =       fvalue.formato;
    entity.publico =       fvalue.publico;
    entity.sector =       fvalue.sector;

    entity.sede =       fvalue.sede;
    entity.locacion =       fvalue.locacion;


		return entity;
	}


}

//5e2dc686fd5a89361ae7b591
