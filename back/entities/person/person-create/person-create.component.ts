import { Component, OnInit, Directive } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { Person } from './../person';
import { PersonService} from './../person.service';


function initForSave(form: FormGroup, model: Person): Person {
	const fvalue = form.value;
  console.log('fvalue displayname [%s]', fvalue.displayName)
	const entity: Person = new Person(fvalue.displayName);

	return entity;

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
	private models: Person[];

  constructor(
  	private fb: FormBuilder,
  	private router: Router,
    private route: ActivatedRoute,
  	private personService: PersonService
  	) { }


  ngOnInit() {
    console.log('PersonCreateComponent')
  	this.model = new Person('');

  	this.form = this.fb.group({

  		displayName:[null, Validators.compose([Validators.required])],
  	
  	});
  }
  onSubmit(){
  	this.model = initForSave( this.form, this.model);
    this.personService.create(this.model)
      .then(model => {
        console.log('Entidad Creada!: [%s] [%s]', model._id, model.displayName)
        this.router.navigate(['../', this.model.displayName], { relativeTo: this.route });
      })


  }

}
