import { Injectable }    from '@angular/core';

import { Observable ,  Subject }    from 'rxjs';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { Folder, folderModel } from './folder.model';
import { BasicData }           from '../base.model';
import { Tag }                 from '../develar-entities';

import { DaoService }  from '../dao.service';
import { UserService } from '../../entities/user/user.service';
import { User }        from '../../entities/user/user';


const whoami = 'entity.controller';

const newEntityConfirm = {
  width:  '330px',
  height: '300px',
  hasBackdrop: true,
  backdropClass: 'yellow-backdrop',
  data: {
    caption:'Alta de nueva entidad',
    title: 'Confirme la acción',
    body: 'Se dará de alta: ',
    accept:{
      action: 'accept',
      label: 'Aceptar'
    },
    cancel:{
      action: 'cancel',
      label: 'Cancelar'
    }
  }
};

function initForSave(basicData: BasicData, model: Folder, user: User): Folder {
  model.name = basicData.name;
  model.slug    = basicData.slug;
  model.description = basicData.description;
  model.taglist = basicData.taglist;
  model.user = user.username;
  model.userId = user._id;
  return model;
};

@Injectable()
export class ModelController {

  private backendUrl = 'api/folders';
  private searchUrl  = 'api/folders/search';
  private model;
  private emitModel = new Subject<Folder>();
  private basicData: BasicData;
  private modelId;
  private tags: Tag[] = [];
  

  private handleError(error: any): Promise<any> {
    console.error('[%s]: Ocurrió un error: [%s]',whoami, error);
    return Promise.reject(error.message || error);
  }

  constructor(
    private daoService: DaoService,
    public snackBar: MatSnackBar,
    public userService: UserService) { 
  }


  findById<T>(type:string, modelId: string):Promise<T>{
    return this.daoService.findById<T>('folder', modelId)
      .then(response => {
        if(response){
          this.model = response;
          this.initBaseData();
        }
        return response as T

      })
      .catch(err => {
        return err;
      });
  }

  getModelListener():Subject<Folder>{
    return this.emitModel;
  }

  getBasicData():BasicData {
    return this.basicData;
  }

  initFolderEdit(model: Folder, modelId: string){
    if(model){
      this.model = model;
      this.initBaseData();
    }else if(modelId){
      this.findById<Folder>('folder', modelId);
    }else{
      this.initNewModel()

    }
  }

  setTags(tags:Tag[]){
    this.tags = tags;
  }


  initNewModel(){
    this.model = folderModel.initNew('','',null,null);
    this.initBaseData();
  }

  initBaseData(){
    this.modelId = this.model._id
    this.basicData = {
      name: this.model.name, 
      slug: this.model.slug, 
      description: this.model.description, 
      taglist: this.model.taglist
    }
    this.emitModel.next(this.model);
  }


  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {
      duration: 3000,
    });

    snck.onAction().subscribe((e)=> {
    })
  }

  // ****** SAVE ******************
  saveRecord(){
    this.model = initForSave(this.basicData, this.model, this.userService.currentUser);

    if(this.modelId){
      return this.daoService.update<Folder>('folder', this.modelId, this.model).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });

    }else{
      return this.daoService.create<Folder>('folder', this.model).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });
    }
  }

}
