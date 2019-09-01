import { Component, OnInit, Input, TemplateRef, ViewChild}  from '@angular/core';
import { Router }   from '@angular/router';

import { SharedService }      from '../../develar-commons/shared-service';

import { RecordCard }         from '../recordcard';
import { RecordCardService }  from '../bookshelf.service';

import { Observable }        from 'rxjs';


@Component({
  selector: 'app-cardsviewlist',
  templateUrl: './cardsviewlist.component.html',
  styleUrls: ['./cardsviewlist.component.scss']
})
export class CardsviewlistComponent implements OnInit {
	@ViewChild('actionsTmpl', { static: true }) public actionsTemplate: TemplateRef<any>
  @ViewChild('viewcardTmpl', { static: true }) public viewcardTmpl: TemplateRef<any>
  public models: RecordCard[] = [];

  @Input()
  set cards(models: RecordCard[]){
    this.models = models;
    // models.subscribe((models: RecordCard[]) => {
    //   this.models = models;
    // })
  }


	pageTitle: string = "Vista tabulada";

	selectedModel:  RecordCard;

	columns = [];
	rows = [];
	loadingIndicator: boolean = true;

	getModels(): void{
		this.recordcardService.loadRecordCards<RecordCard>({})
			.then(models =>{
				this.models = models;
				setTimeout(()=>{this.loadingIndicator = false}, 1500);
			});

	}

  constructor(
  		private recordcardService: RecordCardService,
  		private _sharedService: SharedService
  	) { 

  }

  ngOnInit() {
    this.columns = [
      {prop: 'slug', name: 'Título', minWidth: 300, cellTemplate: this.viewcardTmpl},
      {prop: 'cardId', name: 'ID', minWidth: 120},
      {prop: 'cardType', name: 'Tipo', minWidth: 150},
      {prop: 'taglist', name: 'Etiquetas', minWidth: 250},
      {prop: '_id', name: 'Acciones', width:'150', sortable: false, cellTemplate: this.actionsTemplate},

    ];

    if(!(this.models && this.models.length)){
      this.getModels();
    }else{
      setTimeout(()=>{this.loadingIndicator = false}, 1500);
    }


  }

}
