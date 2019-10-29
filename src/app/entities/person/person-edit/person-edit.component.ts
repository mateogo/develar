import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, Address, personModel} from './../person';
import { PersonService} from './../person.service';
import { devutils }from '../../../develar-commons/utils'

const LIST = '../'

function initForSave(form: FormGroup, model: Person): Person {
	const fvalue = form.value;
  const locacionesDeepCopy: Address[] = fvalue.guaridas.map(
      (address: Address) => Object.assign({}, address)
    );

  const entity = model; 
  entity.displayName = fvalue.displayName;
  entity.email = fvalue.email;
  entity.locacion = fvalue.locacion;
  entity.personType = fvalue.personType;
  entity.locaciones = locacionesDeepCopy;
  entity.nombre = fvalue.nombre;
  entity.apellido = fvalue.apellido;
  entity.tdoc = fvalue.tdoc;
  entity.ndoc = fvalue.ndoc;
  entity.tprofesion = fvalue.tprofesion;
  entity.especialidad = fvalue.especialidad;
  entity.ambito = fvalue.ambito;

	return entity;
};

@Component({
  selector: 'person-edit',
  templateUrl: './person-edit.component.html',
  styleUrls: ['./person-edit.component.scss']
})
export class PersonEditComponent implements OnInit {

	pageTitle: string = 'Actualización de Persona';
	public form: FormGroup;
	public model: Person;
	private models: Person[];
  private modelId: string;
  public ph = personModel;
  private provincias = personModel.provincias;
  private addTypes = personModel.addressTypes;
  private countries = personModel.countries;
  public persontypes = personModel.persontypes;
  public tcompPersonaFisica = personModel.tipoDocumPF;
  public tprofPersonaFisica = personModel.profesiones;

  private showMaps = false;
  public renderMap = false;
  private zoom: number = 8;
  private location = {
    lat:  -34.5922017,
    lng:  -58.41167669999999,
    label: ''

  }







  constructor(
  	private fb: FormBuilder,
  	private router: Router,
  	private personService: PersonService,
    private route: ActivatedRoute
  	) { 
      this.form = this.fb.group({
        displayName:[null, Validators.compose([Validators.required])],
        personType:[null, Validators.compose([Validators.required])],
        email:[null],
        locacion: [null],
        nombre:[null],
        apellido:[null],
        tdoc:[null],
        tprofesion:[null],
        especialidad:[null],
        ambito:[null],
        ndoc:[null],
        //address: this.fb.group(new Address())
      });
      this.setAddresses([]);

    }


  get guaridas(): FormArray {
    return this.form.get('guaridas') as FormArray;
  };


  ngOnInit() {
  	this.model = new Person('');
    setTimeout((()=> this.showMaps = true), 10000 );

    this.modelId = this.route.snapshot.paramMap.get('id');

    this.personService.getPerson(this.modelId)
      .then(entity =>{
        // OjO Trucho
        if(!entity) console.log('ver qué hacer: NO EXISTE EL USER');
         
        this.model = entity;


        this.form.reset({
          displayName:    this.model.displayName,
          email:    this.model.email,
          locacion: this.model.locacion,
          personType:    this.model.personType,
          nombre: this.model.nombre,
          apellido: this.model.apellido,
          tdoc: this.model.tdoc,
          tprofesion: this.model.tprofesion,
          especialidad: this.model.especialidad,
          ambito: this.model.ambito,
          ndoc: this.model.ndoc
        });

        this.setAddresses(this.model.locaciones)
      });


  }

  setAddresses(addresses: Address[]) {
    addresses.forEach(t => {
      t.zip = t.zip || '';
    })
    const addressFGs = addresses.map(address => this.fb.group(address));
    const addressFormArray = this.fb.array(addressFGs);
    this.form.setControl('guaridas', addressFormArray);
  }

  ngOnChanges(){
    this.form.reset({ //setValue/patchValue
      displayName:    this.model.displayName,
      email:    this.model.email,
      personType:    this.model.personType
    });
    this.setAddresses(this.model.locaciones)
  };


  addLocation_Paso_a_Paso_toBe_Trashed(){
    const locacionesDeepCopy: Address[] = this.form.value.guaridas.map(
      (address: Address) => Object.assign({}, address)
    );
    locacionesDeepCopy.push(personModel.initAddress({street:'quintana 2135'}));
    const addressFGs = locacionesDeepCopy.map(address => this.fb.group(address));
    const addressFormArray = this.fb.array(addressFGs);

    this.form.setControl('guaridas', addressFormArray);

  }

  removeLocation(item){

    const formArray = this.form.get('guaridas') as FormArray;
 
    formArray.removeAt(item);
  }

  addLocation(){
    const locacionFG = this.fb.group(personModel.initAddress());
    const formArray = this.form.get('guaridas') as FormArray;
    formArray.push(locacionFG);
  }

  changeAddType(item){
    const formArray = this.form.get('guaridas') as FormArray;
    formArray.at(item).patchValue({slug: personModel.fetchAddrTypeLabel(formArray.at(item).value.addType)});

  }

  changeProvincia(item){
    const formArray = this.form.get('guaridas') as FormArray;
    formArray.at(item).patchValue({statetext: personModel.fetchProvinceLabel(formArray.at(item).value.state)});
  }

  changePersonType(){
  }
  
  dateToText(datenum:number){
    return devutils.txFromDate(new Date(datenum))
  }

  mapLookUp(address: Address){
    this.showMap(address);
  }

  onSubmit(){
  	this.model = initForSave( this.form, this.model);
    this.personService.update(this.model)
      .then(model => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }

  showMap(address: Address){
    this.personService.addressLookUp(address)
    .then(data => {
      if(data.status === 'OK'){

        this.zoom = 15;
        this.location = data.location;
        this.location.label = this.model.displayName + '@' +  address.description;
        this.renderMap = true;
      }

    });

  }

  closeEditor(target){
    this.router.navigate([target], { relativeTo: this.route });
  }

  editCancel(){
    this.closeEditor(LIST);
  }

  changeSelectionValue(type, val){
  }

}
