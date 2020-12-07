import { Component, OnInit, Input } from '@angular/core';
import { PersonContactData } from '../../../../entities/person/person';

@Component({
  selector: 'personas-contactdata-view',
  templateUrl: './personas-contactdata-view.component.html',
  styleUrls: ['./personas-contactdata-view.component.scss']
})
export class PersonasContactdataViewComponent implements OnInit {

  @Input() token: PersonContactData;

	public tipo;
	public type;
	public data;
  public slug;
  
  constructor() { }

  ngOnInit(): void {
  	this.tipo = this.token.tdato;
  	this.type = this.token.type;
  	this.data = this.token.data;
  	this.slug = this.token.slug;  
  }

}
