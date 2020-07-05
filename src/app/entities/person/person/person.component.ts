import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute }   from '@angular/router';

import { Observable } from 'rxjs';

import { DatatableComponent } from '@swimlane/ngx-datatable'

import { SharedService } from '../../../develar-commons/shared-service';

import { Person }        from '../person';
import { PersonService}  from '../person.service'

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {
	@ViewChild('actionsTmpl', { static: true }) public actionsTmpl: TemplateRef<any>
  @ViewChild(DatatableComponent) table: DatatableComponent;

  person$: Observable<Person[]>;

	pageTitle: string = "Módulo Personas";
	models: Person[] = [];
	selectedModel: Person;

	columns = [];
	rows = [];
	loadingIndicator: boolean = true;

	getModels(): void{
		this.personService.getPersons()
			.then(models => {
				this.models = models;
				setTimeout(() => {this.loadingIndicator = false} , 1500);
			});
	}

	gotoDetail():void {
		this.router.navigate(['./', this.selectedModel.id], { relativeTo: this.route })
	}

  constructor(
  	private personService: PersonService,
  	private router: Router,
  	private route: ActivatedRoute,
  	private _sharedService: SharedService) {

		}

  ngOnInit() {
  	//this.getModels();
  	//this._sharedService.emitChange('Personas')

  	this.columns = [
			{ prop: 'id',          name: 'ID', minWidth:'65'},
			{ prop: 'displayName', name: 'Mostrar como...', minWidth:'250' },
			{ prop: '_id', name: 'Acciones', width:'150' , sortable: false, cellTemplate: this.actionsTmpl},
  	];
  }

  fetchPerson$(persons: Person[]){
  	this.models = persons;
  }
//http://develar-local.co:4200/dsocial/gestion/atencionsocial

}
