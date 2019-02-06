import { Component, OnInit, Directive } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person, RecordCardRelation, personModel} from './../person';

import { PersonService} from './../person.service';
import { UserService }   from '../../user/user.service';
import { User }      from '../../user/user';


function initForSave(form: FormGroup, model: Person, ficha: RecordCardRelation, user: User): Person {
	const fvalue = form.value;

  model.displayName = fvalue.displayName;
  model.email = fvalue.email;
  model.personType = fvalue.personType;
  model.nombre = fvalue.nombre;
  model.apellido = fvalue.apellido;
  model.tdoc = fvalue.tdoc;
  model.ndoc = fvalue.ndoc;
  model.tprofesion = fvalue.tprofesion;
  model.especialidad = fvalue.especialidad;
  model.ambito = fvalue.ambito;
  model.fichas = [];
  model.user = {
    userid: user._id,
    username: user.displayName
  }
  model.communitylist = [user.communityId];

  if( fvalue.subtitle ) {
    let ficha = personModel.initRelatedCard({subtitle: fvalue.subtitle, slug: model.displayName, topic: fvalue.topic });
    model.fichas.push(ficha);
  }

  return model;
};


@Component({
  selector: 'person-create',
  templateUrl: './person-create.component.html',
  styleUrls: ['./person-create.component.scss']
})

export class PersonCreateComponent implements OnInit {
	pageTitle: string = 'Alta nueva persona';
	public form: FormGroup;
	private model: Person;
  private ficha: RecordCardRelation;
	private models: Person[];
  public persontypes = personModel.persontypes;
  public tcompPersonaFisica = personModel.tipoDocumPF;
  public tprofPersonaFisica = personModel.profesiones;
  public currentUser: User;
  public communityId = '';

  constructor(
  	private fb: FormBuilder,
  	private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
  	private personService: PersonService
  	) { }


  ngOnInit() {
    console.log('PersonCreateComponent')
  	this.model = new Person('');
    this.currentUser = this.userService.currentUser;
    console.log('currentUser: [%s]  [%s]', this.currentUser.displayName, this.currentUser.communityId)

  	this.form = this.fb.group({
        displayName:[null, Validators.compose([Validators.required])],
        personType:[null, Validators.compose([Validators.required])],
        email:[null],
        nombre:[null],
        apellido:[null],
        tdoc:[null],
        tprofesion:[null],
        especialidad:[null],
        ambito:[null],
        ndoc:[null],
        subtitle:[null],
        topic:[null],
  	});
  }

  onSubmit(){
    this.model = new Person('');
    this.ficha = new RecordCardRelation();
  	this.model = initForSave( this.form, this.model, this.ficha, this.currentUser);
    this.saveRecord(this.model);
  }

  navigateToMenu(){
    this.router.navigate(['../', this.model.displayName], { relativeTo: this.route });
  }

  saveRecord(entity){
    this.personService.create(entity)
      .then(model => {
        console.log('Entidad Creada!: [%s] [%s]', model._id, model.displayName)
      })
  }

  changeSelectionValue(type, val){
    console.log('Change [%s] nuevo valor: [%s]', type, val);
  }

  changePersonType(){
  }

}
