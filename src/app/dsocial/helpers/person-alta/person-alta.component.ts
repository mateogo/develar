import { Component, OnInit,Output, Input, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Person, personModel } from '../../../entities/person/person';
import { User } from '../../../entities/user/user';
import { DsocialController } from '../../dsocial.controller';

function initForSave(form: FormGroup, model: Person, user: User): Person {
    const fvalue = form.value;
    model.nombre = fvalue.nombre;
    model.personType = fvalue.personType;
    model.apellido = fvalue.apellido;
    model.tdoc = fvalue.tdoc;
    model.ndoc = fvalue.ndoc;
    model.displayName = model.apellido + ', '+ model.nombre;
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
    public persontypes = personModel.persontypes;
    public tcompPersonaFisica = personModel.tipoDocumPF;
    public currentUser: User;
    public communityId = '';

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
            apellido: [null, Validators.compose([Validators.required])],
            tdoc: [null],
            ndoc: [null],
        });

        this.resetForm(this.model);
    }

    onSubmit() {
        console.log('AIJUNAAAAAA')
        this.model = initForSave(this.form, this.model, this.currentUser);
        this.dsCtrl.createPerson(this.model)
            .then(person => {
                this.person$.emit(person);
            });
    }

    cancel(){
        this.cancel$.emit(true);
    }

    documProvisorio(){
        console.log('asignar número provisorio');
        this.dsCtrl.fetchSerialDocumProvisorio().subscribe(serial =>{
            this.model = initForSave(this.form, this.model, this.currentUser);
            this.model.tdoc = "PROV"
            let prox =  serial.pnumero + serial.offset;
            this.model.ndoc = prox + "";
            this.resetForm(this.model);
        });
    }


    resetForm(model: Person) {
        this.form.reset({
            personType: model.personType,
            nombre: model.nombre,
            apellido: model.apellido,
            tdoc: model.tdoc,
            ndoc: model.ndoc
        });
    }

    changeSelectionValue(type, val) {
    }

    changePersonType() {
    }


}
