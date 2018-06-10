import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable }        from 'rxjs';

import { User } from '../../user';

@Component({
  selector: 'page-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})

export class PageConfirmComponent implements OnInit {
	@Input() user: User;
	email: string;
  //email: Observable<string>;
	//email:string;

  constructor(private route: ActivatedRoute) { 
		//const url: Observable<string> = route.url.map(segments => segments.join(''));
		// route.data includes both `data` and `resolve`
		//const user = route.data.map(d => d.user);  	

  }

  ngOnInit() { 
  	// tres opciones equivalentes para trabajar con el Observable
  	//Opción-1:
  	this.email =  this.route.snapshot.paramMap.get('id');

  	//Opción-2:
		//this.route.params.map(p => p.id).subscribe(x => {this.email = x;});

  	//Opción-3:
		//this.email = this.route.params.map(p => p.id);
		//modificar el template por: <strong>{{email|asyinc}}</strong>. 
  	//Opción-4:

		//this.email = this.route.params.map(p => p.id).toPromise();
		//modificar el template por: <strong>{{email|asyinc}}</strong>. 

  }
}
