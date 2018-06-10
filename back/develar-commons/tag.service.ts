import { Injectable }    from '@angular/core';

import { Observable, Subject, of }    from 'rxjs';
import { catchError }     from 'rxjs/operators';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Tag } from './develar-entities';

import { DaoService } from './dao.service';

const whoami = 'tag.service';

const daoConfig = {
  type: 'tag',
  backendURL: 'api/tags',
  searchURL: 'api/tags/search'
}


function initForSave(model: Tag): Tag {

  return model;
};


@Injectable()
export class TagService {

  private model;
  private emitModel = new Subject<Tag>();
  private modelId;
  

  private handleError(error: any): Promise<any> {
    console.error('[%s]: Ocurrió un error: [%s]',whoami, error);
    return Promise.reject(error.message || error);
  }

  constructor(
    private daoService: DaoService,
    public snackBar: MatSnackBar) { 
  }

  daoConfig(){
    return daoConfig;
  }

  fetch(type:string, modelId: string):Promise<Tag>{
    return this.daoService.findById<Tag>('tag', modelId)
      .then(response => {
        if(response){
          this.model = response;
          this.emitModel.next(this.model);
        }
        return response as Tag


      })
      .catch(err => {
        console.log(err);
        return err;
      });


  }

  getModelListener():Subject<Tag>{
    return this.emitModel;
  }

  initTagEdit(model: Tag, modelId: string){
    if(model){
      this.model = model;
      this.emitModel.next(model);
    }else if(modelId){
      this.fetch('tag', modelId);
    }else{
      this.initNewModel()

    }
  }

  initNewModel(){
    this.model = new Tag();
    this.modelId = this.model._id
    this.emitModel.next(this.model);
  }



  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {
      duration: 3000,

    });

    snck.onAction().subscribe((e)=> {
      console.log('action???? [%s]', e);
    })
  }

  // ****** SAVE ******************
  saveRecord(){
    this.model = initForSave(this.model);
    if(this.modelId){
      return this.daoService.update<Tag>('tag', this.modelId, this.model).then((model) =>{
              console.log('save OK, opening snakbar')
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });


    }else{
      return this.daoService.create<Tag>('tag', this.model).then((model) =>{
              console.log('save OK, opening snakbar')
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });

    }
  }
}
