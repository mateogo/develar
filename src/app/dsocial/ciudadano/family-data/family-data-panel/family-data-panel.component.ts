import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig }           from '@angular/material';

import {  Person,
          personModel,
          UpdateFamilyEvent,
          UpdateItemListEvent,
          FamilyData 
        } from '../../../../entities/person/person';

const TOKEN_TYPE = 'family';
const CANCEL = 'cancel';
const DELETE = 'delete';
const UPDATE = 'update';

@Component({
  selector: 'family-panel',
  templateUrl: './family-data-panel.component.html',
  styleUrls: ['./family-data-panel.component.scss']
})
export class FamilyDataPanelComponent implements OnInit {

	@Input() items: Array<FamilyData>;
	@Output() updateItems = new EventEmitter<UpdateItemListEvent>();

  public title = 'Vinculos Familiares';
	public showList = false;
  public openEditor = true;

  constructor(private snackBar: MatSnackBar) { }

  ngOnInit() {
  	if(this.items && this.items.length){
  		this.showList = true;
  	}

  }

  updateItem(event: UpdateFamilyEvent){
    console.log('updateItems');
    
    if(event.action === DELETE){
      this.deleteItem(event.token);
    }

    if(event.action === UPDATE){
      console.log('validate Documents')
      if(this.validateFamilyList()){
        this.emitEvent(event);
      }else{
        this.openSnackBar('Hay números de documento repetidos', 'aceptar');
      }
    }

  }

  private validateFamilyList(): boolean {
    let valid = true;
    let test = {};
    this.items.forEach(t => {
      let ndoc = t.tdoc + t.ndoc;
      console.log('itemsForEach [%s]', ndoc)
      if(test[ndoc]){
        valid = false
      }else{
        test[ndoc] = ndoc;
      }
    })


    return valid;
  }

  private openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {duration: 3000});

    snck.onAction().subscribe((e)=> {
      console.log('action???? [%s]', e);
    })
  }



  deleteItem(t:FamilyData){
    let index = this.items.indexOf(t);

    if(index !== -1){
      this.items.splice(index, 1)
    }
    
  }

  addItem(){
    let item = new FamilyData();

    if(this.items){
      this.items.push(item);
    }else{
      this.items = [item]
    }

    this.showList = true;
  }

  emitEvent(event:UpdateFamilyEvent){
  
  	if(event.action !== CANCEL){
  		this.updateItems.next({
  		action: UPDATE,
  		type: TOKEN_TYPE,
  		items: this.items as FamilyData[]
  	});
  	}
  }

}