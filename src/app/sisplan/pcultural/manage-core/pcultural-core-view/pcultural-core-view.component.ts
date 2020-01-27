import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { devutils }from '../../../../develar-commons/utils'

import { SisplanController } from '../../../sisplan.controller';

import { UpdateEvent } from '../../../sisplan.service';

import { Pcultural, PculturalHelper } from '../../pcultural.model';


@Component({
  selector: 'pcultural-core-view',
  templateUrl: './pcultural-core-view.component.html',
  styleUrls: ['./pcultural-core-view.component.scss']
})
export class PculturalCoreViewComponent implements OnInit {
	@Input() pcultural: Pcultural;
	public compPrefix ;
	public compName;
	public compNum ;
	public type ;
	public stype ;
	public sector;
	public publico;
	public formato ;
	public programa ;
	public sede;
	public locacion ;
	public slug;
  public estado;


  constructor(
      private router: Router,

    ) { }

  ngOnInit() {
  	this.compPrefix = this.pcultural.compPrefix;
  	this.compName = this.pcultural.compName;
  	this.compNum = this.pcultural.compNum;
  	this.slug = this.pcultural.slug;

  	let stypeOptList = PculturalHelper.getSubTypeMap()[this.pcultural.type] || [];
  	let locacionOptList = PculturalHelper.getLocacionMap()[this.pcultural.sede] || [];
 

  	this.type = PculturalHelper.getOptionLabel('type', this.pcultural.type);
 		this.stype = PculturalHelper.getOptionLabelFromList(stypeOptList, this.pcultural.stype);

  	this.sector = PculturalHelper.getOptionLabel('sector', this.pcultural.sector);
  	this.publico = PculturalHelper.getOptionLabel('publico', this.pcultural.publico);
  	this.formato = PculturalHelper.getOptionLabel('formato', this.pcultural.formato);
  	this.programa = PculturalHelper.getOptionLabel('programa', this.pcultural.programa);

  	this.sede = PculturalHelper.getOptionLabel('sede', this.pcultural.sede);
  	this.locacion = PculturalHelper.getOptionLabelFromList(locacionOptList, this.pcultural.locacion);
    this.estado = this.pcultural.estado;


  }

  navigate(p:Pcultural){
    let id = p._id;
    console.log('ready To Navigate: [%s]', id);
    this.router.navigate(['/cck/gestion/proyectos', id] );
  }
}
