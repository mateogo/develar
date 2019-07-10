import { Component, OnInit,Output, Input, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap }   from 'rxjs/operators';

import { AbstractControl, ValidatorFn, FormBuilder, FormGroup, Validators, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Person, Address, personModel } from '../../../entities/person/person';
import { User } from '../../../entities/user/user';
import { DsocialController } from '../../dsocial.controller';
import { devutils }from '../../../develar-commons/utils'

function initForSave(form: FormGroup, model: Person, user: User): Person {
    const fvalue = form.value;
    const address = new Address();

    model.nombre = fvalue.nombre;
    model.personType = fvalue.personType;
    model.apellido = fvalue.apellido;
    model.tdoc = fvalue.tdoc;
    model.ndoc = fvalue.ndoc;
    model.displayName = model.apellido + ', '+ model.nombre;
    model.sexo = fvalue.sexo;
    model.fenactx = fvalue.fenactx;
    model.nacionalidad = fvalue.nacionalidad;

    address.addType = 'dni' ;
    address.slug = 'alta en Recepción' ;
    address.isDefault = true;

    address.street1 =      fvalue.street1;
    address.street2 =      fvalue.street2;
    address.city =         fvalue.city;
    address.barrio =       fvalue.barrio;
    address.zip =          fvalue.zip;

    address.state =        fvalue.state;
    address.statetext =    fvalue.statetext;
    address.country =      fvalue.country;

    model.locaciones = [ address ];



    if(fvalue.fenactx){
      model.fenac = devutils.dateFromTx(fvalue.fenactx).getTime();

    }else{
      model.fenac = 0;
    }


    return model;
};

@Component({
  selector: 'person-alta',
  templateUrl: './person-alta.component.html',
  styleUrls: ['./person-alta.component.scss']
})
export class PersonAltaComponent implements OnInit {
	@Input() user: User;
    @Input() data = {};
	@Output() person$ = new EventEmitter<Person>();
	@Output() cancel$ = new EventEmitter<boolean>();

    pageTitle: string = 'Alta de nueva persona';
    public form: FormGroup;
    private model: Person;
    public currentUser: User;
    public communityId = '';

    public persontypes = personModel.persontypes;
    public tcompPersonaFisica = personModel.tipoDocumPF;
    public estadoCivil        = personModel.estadoCivilOL;
    public sexoOptList        = personModel.sexoList;

    public countriesList =  personModel.paises;
    public provinciasList = personModel.provincias;
    public addTypeList =    personModel.addressTypes;
    public ciudadesList =   personModel.ciudades;
    public paises     = personModel.paises;
    public barrioList = [];

    constructor(
        private fb: FormBuilder,
        private router: Router,
       	private dsCtrl: DsocialController,

    ) { }

    ngOnInit() {
        this.model = new Person('');
        this.model.tdoc = this.data['tdoc'] || 'DNI';
        this.model.ndoc = this.data['ndoc'];
        this.model.personType = 'fisica';


        this.form = this.fb.group({
            personType: [null, Validators.compose([Validators.required])],
            nombre: [null, Validators.compose([Validators.required])],
            apellido: [null, Validators.compose( [Validators.required])],
            tdoc: [null],
            ndoc: [null, [Validators.required, 
                          Validators.minLength(7),
                          Validators.maxLength(10),
                          Validators.pattern('[0-9]*')], 
                          [this.dniExistenteValidator(this.dsCtrl)] ],

            sexo:         [null],
            fenactx:      [null, [this.fechaNacimientoValidator()]],
            nacionalidad: [null],

            street1:     [null, Validators.compose([Validators.required])],
            street2:     [null],
            city:        [null],
            barrio:      [null],
            zip:         [null],

            state:       [null],
            statetext:   [null],
            country:     [null],

        });

        this.resetForm(this.model);
    }

    onSubmit() {
        this.model = initForSave(this.form, this.model, this.currentUser);

        this.dsCtrl.createPerson(this.model).then(person => {
            this.person$.emit(person);
        });

    }

    cancel(){
        this.cancel$.emit(true);
    }

    documProvisorio(){
        this.dsCtrl.fetchSerialDocumProvisorio().subscribe(serial =>{
            this.model = initForSave(this.form, this.model, this.currentUser);
            this.model.tdoc = "PROV"
            let prox =  serial.pnumero + serial.offset;
            this.model.ndoc = prox + "";
            this.resetForm(this.model);
        });
    }


    resetForm(model: Person) {
        let address = new Address();
        address.addType = 'dni' ;
        address.slug = 'dirección en el DNI' ;
        address.isDefault = true;

        this.form.reset({
            personType: model.personType,
            nombre: model.nombre,
            apellido: model.apellido,
            tdoc: model.tdoc,
            ndoc: model.ndoc,
            sexo: model.sexo,
            fenactx: model.fenactx,
            nacionalidad: model.nacionalidad,

            street1:     address.street1,
            street2:     address.street2,
            city:        address.city,
            barrio:      address.barrio,
            zip:         address.zip,

            state:       address.state ||'buenosaires',
            statetext:   address.statetext || 'Brown' ,
            country:     address.country || 'AR',
        });
        this.barrioList = personModel.getBarrioList(address.city);
    }

    changeSelectionValue(type, val) {
    }

    changeCity() {
        this.barrioList = personModel.getBarrioList(this.form.value.city);

        let zip = personModel.fetchCP(this.form.value.city);
        this.form.controls['zip'].setValue(zip);
    }


    changePersonType() {
    }

    hasError = (controlName: string, errorName: string) =>{
        return this.form.controls[controlName].hasError(errorName);
    }

    dniExistenteValidator(service: DsocialController): AsyncValidatorFn {
        return ((control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
            let value = control.value;

            return service.testPersonByDNI('DNI',value).pipe(
                map(t => {
                    return t && t.length>0 ? { 'mailerror': 'DNI existente' }: null;
                })

             )

        }) ;
     } ;

     currentAge(){
         let edad = '';
         let value = this.form.value.fenactx
         let validAge = devutils.validAge(value);
         if(validAge){
             edad = devutils.edadActual(devutils.dateFromTx(value)) + '';
         }
         return edad;
     }


    fechaNacimientoValidator(): ValidatorFn {
        return ((control: AbstractControl) : {[key: string]: any} | null  => {
            let validAge = devutils.validAge(control.value);
            console.log('fechaNacimientoVALIDATOR: [%s]', validAge);
            return validAge ? null : {'invalidAge': true}

        }) ;
     }
    
}
