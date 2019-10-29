import { Component, OnInit } from '@angular/core';

import { Router, ActivatedRoute }   from '@angular/router';

import { Folder }    from '../folder.model';
import { BasicData } from '../../base.model';
import { Tag }       from '../../develar-entities';
import { ModelController } from '../model.controller';

import { Subject } from 'rxjs';


const LIST = '/test/folders';
const EDIT = '/test/folder/';


@Component({
  selector: 'app-foldercreate',
  templateUrl: './foldercreate.component.html',
  styleUrls: ['./foldercreate.component.scss']
})
export class FoldercreateComponent implements OnInit {

	pageTitle: string = 'Alta nueva carpeta';

	public model: Folder;
  private modelId: string;


  // valores default para el medium-editor para campo descripción
  public meContent: string = '';
  public mePlaceholder: string = 'Descripción';

  basicData: BasicData;
  private modelListener: Subject<Folder>;
  private tags: Tag[] = [];


  constructor(
    private modelCtrl: ModelController,
    private router: Router,
    private route: ActivatedRoute,

  	) { 

  }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id')
    this.modelListener = this.modelCtrl.getModelListener();

    this.modelListener.subscribe(model =>{
      this.model = model;
      this.basicData = this.modelCtrl.getBasicData();
    })

    this.modelCtrl.initFolderEdit(this.model, id);

  }


  /*********  SAVE & ?? **********/
  save(target:string){
    this.modelCtrl.saveRecord().then(model =>{
        if(target === 'navigate'){
          this.closeEditor(LIST);

        }else if(target === 'continue'){
          this.continueEditing(model);

        }
    })
  }
  

  /*********  CONTINUE OR LEAVE **********/
  continueEditing(model){
    this.model = model;
    this.modelCtrl.getBasicData();
    this.modelId = model._id;
    //delete this.model._id;
  }

  closeEditor(target){
    this.router.navigate([target]);
  }

  editCancel(){
    this.closeEditor(LIST);
  }

}
