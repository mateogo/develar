import { Component, OnInit, Input}  from '@angular/core';
import { Router }   from '@angular/router';

import { SharedService }      from '../../develar-commons/shared-service';

import { RecordCard }         from '../recordcard';
import { RecordCardService }  from '../bookshelf.service';

@Component({
  selector: 'app-cardsviewgrid',
  templateUrl: './cardsviewgrid.component.html',
  styleUrls: ['./cardsviewgrid.component.scss']
})
export class CardsviewgridComponent implements OnInit {

	@Input() models: RecordCard[];

	pageTitle: string = "Explorador de FICHAS";
	selectedModel:  RecordCard;

	loadingIndicator: boolean = true;
  isAdmin: boolean = true;

  getModels(): void{
    console.log('********** view grid ************')
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
  	//this._sharedService.emitChange(this.pageTitle);

  }

  ngOnInit() {
  	if(!this.models){
			console.log('cardsview INIT: NO models')
  		this.getModels();
  	}else{
			console.log('cardsview INIT: YES!! models')
  	}
  }

}
