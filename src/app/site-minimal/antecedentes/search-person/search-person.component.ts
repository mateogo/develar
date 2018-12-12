import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {Observable, Subject } from 'rxjs';

import { Ciudadano, ciudadanoDefaultFactory } from '../../../antecedentes/model/antecedente';
import { ModelHelper } from '../../../antecedentes/model/antecedentes-helper';
import { devutils } from '../../../develar-commons/utils';

import { DaoService } from '../../../develar-commons/dao.service';


const LIST = '../';

@Component({
  selector: 'search-person',
  templateUrl: './search-person.component.html',
  styleUrls: ['./search-person.component.scss']
})
export class SearchPersonComponent implements OnInit {
  @Input() model: Ciudadano;
  @Input() inCollection: boolean = false;
  @Input() editable: boolean = true;

  @Output() personEmitter = new EventEmitter<Ciudadano>();

  public form: FormGroup;
  public tcompPersonaFisica = [];

  public isInfraccion = true;
  public hasSuccess = false;



  constructor(
  		private fb: FormBuilder,
      private daoService: DaoService
  	) {

  	this.form = this.fb.group({
      tdoc: [null, Validators.compose([Validators.required])],
      ndoc: [null, Validators.compose([Validators.required])],

  	}) 
  }

  ngOnInit() {
    this.tcompPersonaFisica = ModelHelper.personaFisicaCompLst;


  	this.initDataToEdit();


  }

  initDataToEdit(){
  	if(!this.model){
  		this.model = ciudadanoDefaultFactory();
  	}

  	this.formReset(this.model);

  }


  /*********  SAVE & ?? **********/
  searchPerson(target:string){
  	console.log('searchPerson: [%s]', target);
    this.model = this.formToModel(this.form, this.model);
    console.dir(this.model);

    this.daoService.search<Ciudadano>('person', this.model).subscribe(record =>{
      console.log('Promise OK');
      if(record && record.length){
        this.model = record[0];
        console.dir(this.model)
        this.hasSuccess = true;
        this.personEmitter.next(this.model);
      }

    })

  }
  
  closeEditor(target){
    console.log('closeEditor: [%s]', target);
    //this.router.navigate([target], { relativeTo: this.route });
  }

  editCancel(){
    this.closeEditor(LIST);
  }

  formToModel(form: FormGroup, model: Ciudadano): Ciudadano {
  	const fvalue = form.value;

    model.tdoc = fvalue.tdoc;
    model.ndoc = fvalue.ndoc;

  	return model;
  }


  formReset(model){
  	this.form.reset({
      tdoc:   model.tdoc,
      ndoc: model.ndoc,

  	});

  }

  //Template View Helpers
  getDateString(txt){
    console.log('getDate[%s] [%s]', txt,this.form.value.fe_comp );
    let date = devutils.dateFromTx(txt);
    this.form.value.fe_comp = date.toLocaleString();
    return date.toLocaleString();
  }

  changeSelectionValue(type, val){
    console.log('Change [%s] nuevo valor: [%s]', type, val);
  }


}
