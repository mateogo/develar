import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap }   from 'rxjs/operators';


import { devutils }from '../../../develar-commons/utils'

import { DsocialController } from '../../dsocial.controller';
import { BookshelfController } from '../../bookshelf.controller';

import { Person,BeneficiarioAlimentar, personModel } from '../../../entities/person/person';

import { RecordCard, SubCard  } from '../../../site-minimal/recordcard.model';

import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';


function initForSave(form: FormGroup, model: Person): Person {
    const fvalue = form.value;
    model.tdoc = fvalue.tdoc;
    model.ndoc = fvalue.ndoc;

    return model;
};
const CANCEL = "cancel";
const NEXT = "next";
const BACK = "back";
const TARGET = "turnos";
const TARGET_SEGURIDAD = "personalseguridad";
const NUEVO = "nuevo";
const REGISTRAR = "nuevo:cuit"
const UPDATE = "update";
const CORE = 'core';
const FAILED = 'failed';
const SUCCESS = 'success';

const dataLabel = {
  turnos: {
    text: {
      h1: 'Día y hora para retirar la TARJETA ALIMENTAR',
      p1: 'Debes concurrir con tu DNI',
      p2: 'Para consultar si sos beneficiario/a, ingresá el número de DNI'
    },
    value: {
      tdoc: 'DNI',
      personType: 'fisica',
      minlen: 6,
      maxlen: 9
    }
  }
}


@Component({
  selector: 'alimentar-consulta',
  templateUrl: './alimentar-consulta.component.html',
  styleUrls: ['./alimentar-consulta.component.scss']
})
export class AlimentarConsultaComponent implements OnInit {
  private unBindList = [];
  public firstStep = false;
  public secondStep = false;
  public notFoundStep = false;
  public foundStep = false;

  public form: FormGroup;
  private model: Person;
  public beneficiario: BeneficiarioAlimentar;

	public mainimage: string = "";
	public title: string = "";
	public description: string = "";
	public nodes: Array<Servicios> = [];
	public record: RecordCard;

  public text;
  public tcompPersonaFisica = personModel.tipoDocumPF;
  public docBelongsTo = {error: ''};
  private defaultData:any;
  private target = 'turnos'; 


  constructor(
        private fb: FormBuilder,
        private dsCtrl: DsocialController,
        private bkCtrl: BookshelfController,
        private router: Router,
    ) { }

  ngOnInit() {

		this.fetchRecordCard();

      this.model = new Person('');

      this.defaultData = dataLabel[this.target].value
      this.text = dataLabel[this.target].text

      this.model.tdoc = this.defaultData['tdoc'];
      this.model.personType = this.defaultData['personType'];
      this.model.ndoc = ''


      this.buildForm();
      this.resetForm(this.model);


  }

  /**********************/
  /*  template events  */
  /********************/
  onSubmit() {
      this.beneficiario = null;
      this.model = initForSave(this.form, this.model);
      this.checkIfBeneficiario();

      // todo
  }

  cancel(){
    this.secondStep = true;
    this.notFoundStep = false;
    this.foundStep = false;
    this.resetForm(this.model);
    // todo 
  }

  aceptarNotFound(){
    this.model = new Person('');
    this.resetForm(this.model);
    this.secondStep = true;
    this.notFoundStep = false;
    this.foundStep = false;
  }

  aceptarFound(){
    this.model = new Person('');
    this.resetForm(this.model);
    this.secondStep = true;
    this.notFoundStep = false;
    this.foundStep = false;
  }


  changeSelectionValue(type, val) {
  }


  hasError = (controlName: string, errorName: string) =>{
      return this.form.controls[controlName].hasError(errorName);
  }


  /**********************/
  /*  private          */
  /********************/
  private checkIfBeneficiario(){
    this.dsCtrl.fetchBeneficiario(this.model.ndoc).subscribe(results =>{

      if(results && results.length){
        this.beneficiario = results[0];
        this.recibeTarjeta(this.beneficiario);

      }else{
        this.beneficiarioNotFound();
      }
    })
  }

  private recibeTarjeta(beneficiario: BeneficiarioAlimentar){
    this.secondStep = false;
    this.notFoundStep = false;
    this.foundStep = true;

  }

  private beneficiarioNotFound(){
    this.secondStep = false;
    this.notFoundStep = true;
    this.foundStep = false;
  }

  private fetchRecordCard(){
		let query = {
			publish: true,
			"publish.topics": 'dsocial',
			"publish.publishOrder": 'banner:talimentar:turnos',
		}

		let sscrp1 = this.bkCtrl.fetchRecordsByQuery(query).subscribe(records => {
		  this.initRecordCard(records);
		  this.initRenderData()
		  this.firstStep = true;
      this.secondStep = true;
		});

		this.unBindList.push(sscrp1);

  }
  private initRenderData(){
  	// todo ... may be

  }

  private initRecordCard(records: RecordCard[]) {
  	if(records && records.length){
  		this.record = records[0];
  	}else {
  		this.record = new RecordCard("censo banner no encontrado");
  	}

  	this.title = this.record.slug;
  	this.description = this.record.description;
  	this.mainimage = this.record.mainimage;

    if(this.record.relatedcards && this.record.relatedcards.length){
      this.record.relatedcards.forEach(s => {
        let link:string , navigate:string , noLink = true;
        
        if(s.linkTo){
          noLink = false;

          if(s.linkTo.indexOf('http') === -1){
            navigate = s.linkTo;
          }else{
            link = s.linkTo;
          }
        }

        this.nodes.push({
          title: s.slug,
          imageUrl: s.mainimage,
          flipImage: null,
          description: s.description,
          linkTo: link,
          navigateTo: navigate,
          noLink: noLink,
          state: 'inactive'
        } as Servicios)
      })
    }else{
      // error: la ficha no tiene sub-fichas.
   
        this.nodes.push({
          title: 'Error al cargar la ficha',
          imageUrl: this.record.mainimage,
          flipImage: null,
          description: this.record.description,
          linkTo: '',
          navigateTo: '',
          noLink: true,
          state: 'inactive'
        } as Servicios)
    }
  }
  private buildForm(){
    this.form = this.fb.group({
      tdoc: [null],
      ndoc: [null, [Validators.required, 
                    Validators.minLength(this.defaultData['minlen']),
                    Validators.maxLength(this.defaultData['maxlen']),
                    Validators.pattern('[0-9]*')], 
                    [this.dniExistenteValidator(this.dsCtrl, this.docBelongsTo)] ],
    });    
  }

  private resetForm(model: Person) {
      this.form.reset({
        tdoc: model.tdoc,
        ndoc: model.ndoc,
      });
  }


  private dniExistenteValidator(service: DsocialController, message: object): AsyncValidatorFn {
      return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
          let value = control.value;

          return service.testPersonByDNI('DNI',value).pipe(
              map(t => {
                  let invalid = false;
                  let txt = ''

                  message['error'] = txt;
                  return invalid ? { 'mailerror': txt }: null;

              })
           )
      }) ;
   } ;

}


interface RelatedImage {
  predicate: string;
  entityId: string;
  url: string;
  slug: string;
}

interface Servicios {
	imageUrl: string;
  flipImage: RelatedImage;
	description: string;
  title: string;
  linkTo: string;
  navigateTo: string;
  noLink: boolean;
  state: string;
}
