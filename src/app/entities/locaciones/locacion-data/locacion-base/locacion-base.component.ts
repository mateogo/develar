import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { LocacionHospitalaria, LocacionEvent} from '../../locacion.model';

import { LocacionHelper } from '../../locacion.helper';

const NAVIGATE =   'navigate';
const DELETE =     'delete';
const UPDATE =     'update';
const SELECT =     'select';
const CANCEL =     'cancel';
const TOKEN_TYPE = 'locacion';

const BG_COLOR_DEFAULT = "#ffffff";
const BG_COLOR_SELECTED = "#f2eded";


@Component({
  selector: 'locacion-base',
  templateUrl: './locacion-base.component.html',
  styleUrls: ['./locacion-base.component.scss']
})
export class LocacionBaseComponent implements OnInit {
	@Input() locacion: LocacionHospitalaria;
  @Input() viewMode = 'show'; // show||select

	@Output() updateToken = new EventEmitter<LocacionEvent>();

	public showView = true;
	public showEditPanel = false;
  public showEditControl = true;
  public showEditBase = false;

	public openEditor = false;

  public selectedStyle = {};

  constructor() { }

  ngOnInit() {

    if(this.viewMode === 'show'){
      this.showEditControl = true;

    }else{
      this.showEditControl = false;
    }


    // if(!this.locacion.code || this.locacion.code === "00000"){
    //   this.editToken()
    // }


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


  updateLocacionEvent(event: LocacionEvent){
    this.showView = true;
    this.showEditBase = false;
    this.showEditPanel = false;

  	this.emitEvent(event);
  }


  private emitEvent(event: LocacionEvent){
  	if(event.action === UPDATE){
  		this.updateToken.next(event);
  	}
    if(event.action === NAVIGATE){
      this.updateToken.next(event);
    }
    if(event.action === DELETE){
      this.updateToken.next(event);
    }
    if(event.action === SELECT){
      this.updateToken.next(event);
    }
    if(event.action === CANCEL){
      this.updateToken.next(event);
    }
  }


}


interface ChipSchema{
  color:string;
  text: string;
}
