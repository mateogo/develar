import { Component, OnInit, Input, TemplateRef, ViewChild}  from '@angular/core';
import { Router }   from '@angular/router';

import { SharedService }      from '../../shared-service';

import { Folder }         from '../../develar-entities';
import { DaoService }  from '../../dao.service';

import { Observable }        from 'rxjs';


@Component({
  selector: 'folder-browse',
  templateUrl: './folder-browse.component.html',
  styleUrls: ['./folder-browse.component.scss']
})
export class FolderBrowseComponent implements OnInit {
	@ViewChild('actionsTmpl', { static: true }) public actionsTemplate: TemplateRef<any>
  @ViewChild('viewTmpl', { static: true }) public viewTmpl: TemplateRef<any>
  models: Folder[] = [];

  @Input()
  set entities(models: Folder[]){
    this.models = models;
    // models.subscribe((models: Folder[]) => {
    //   this.models = models;
    // })
  }


	pageTitle: string = "Explorador de carpetas";

	selectedModel:  Folder;

	columns = [];
	rows = [];
	loadingIndicator: boolean = true;

	getModels(): void{
		this.daoService.findAll<Folder>('folder')
			.then(models =>{
				this.models = models;
				setTimeout(()=>{this.loadingIndicator = false}, 1500);
			});

	}

  constructor(
  		private daoService: DaoService,
  		private _sharedService: SharedService
  	) { }

  ngOnInit() {
    this.columns = [
      {prop: 'name', name: 'Carpeta', minWidth: 180, cellTemplate: this.viewTmpl},
      {prop: 'slug', name: 'Denominación', minWidth: 250},
      {prop: 'estado', name: 'Estado', minWidth: 80},
      {prop: '_id', name: 'Acciones', minWidth: 90, sortable: false, cellTemplate: this.actionsTemplate},

    ];

    if(!(this.models && this.models.length)){
      this.getModels();
    }else{
      setTimeout(()=>{this.loadingIndicator = false}, 1500);
    }
  }

}
