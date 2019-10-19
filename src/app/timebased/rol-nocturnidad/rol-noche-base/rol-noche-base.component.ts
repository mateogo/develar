import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { TimebasedController } from '../../timebased-controller';

import {  Person } from '../../../entities/person/person';

import { RolNocturnidad, RolNocturnidadItem, UpdateRolEvent }    from '../../timebased.model';

import { TimebasedHelper }    from '../../timebased-helper';


const NAVIGATE = 'navigate';
const UPDATE = 'update';
const SELECT = 'select';
const TOKEN_TYPE = 'rolnocturnidad';

const BG_COLOR_DEFAULT = "#ffffff";
const BG_COLOR_SELECTED = "#f2eded"; //75787B //0645f5


@Component({
  selector: 'rol-noche-base',
  templateUrl: './rol-noche-base.component.html',
  styleUrls: ['./rol-noche-base.component.scss']
})
export class RolNocheBaseComponent implements OnInit {
	@Input() rolnocturnidad: RolNocturnidad;
  @Input() viewMode = 'show'; // show||select

	@Output() updateToken = new EventEmitter<UpdateRolEvent>();

	public showView = true;
	public showEditPanel = false;

  public showEditBase = false;

  public showEditControl = true;
  public showSelectControl = false;

  public modalidad: string;


	public openEditor = false;

  public toggleSelectd = false;
  public selectedStyle = {};

  constructor() { }

  ngOnInit() {

    if(this.viewMode === 'show'){
      this.showEditControl = true;
      this.showSelectControl = false;

    }else if(this.viewMode === 'select'){
      this.showEditControl = false;
      this.showSelectControl = true;

    }

    if(!this.rolnocturnidad.compNum || this.rolnocturnidad.compNum === "00000"){
      this.editToken()
    }
  }

  editToken(){
    this.showEditBase = !this.showEditBase;

    if(this.showEditBase){
      this.showView = false;
      this.showEditPanel = true;

    }else{
      this.showView = true;
      this.showEditPanel = false;

    }
  }

  navigateSeguimiento(){
    this.manageBase({
      action: NAVIGATE,
      type: TOKEN_TYPE,
      token: this.rolnocturnidad
    })
  }

  manageBase(event: UpdateRolEvent){
    this.showEditBase = false;
    this.showEditPanel = false;

  	this.emitEvent(event);
    setTimeout(() => this.showView = true, 400)
  }

  tokenSelected(e){
    console.log('Todo')
  }

  emitEvent(event: UpdateRolEvent){
  	if(event.action === UPDATE){
  		this.updateToken.next(event);
  	}
    if(event.action === NAVIGATE){
      this.updateToken.next(event);
    }
    if(event.action === SELECT){
      this.updateToken.next(event);
    }
  }


	removeToken(){
	}

}

