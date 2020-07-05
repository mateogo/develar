import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators }  from 'ng2-validation';
import { Router, ActivatedRoute }   from '@angular/router';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { Folder, folderModel }    from '../../develar-entities';

import { FolderService } from '../../folder.service';
import { Subject } from 'rxjs';

const LIST = '/test/folders';

function initForSave(form: FormGroup, model: Folder): Folder {
	const fvalue = form.value;

  model.name      = fvalue.name;
  model.slug    = fvalue.slug;
  model.description = fvalue.description;

	return model;
};

@Component({
  selector: 'folderedit',
  templateUrl: './folderedit.component.html',
  styleUrls: ['./folderedit.component.scss']
})
export class FoldereditComponent implements OnInit {

	pageTitle: string = 'Alta nueva ficha';

	public form: FormGroup;
	public model: Folder;
  public modelId: string;

  // valores default para el medium-editor para campo descripción
  meContent: string = '';
  mePlaceholder: string = 'Descripción';


  constructor(
  	private fb: FormBuilder,
  	private folderService: FolderService,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,

  	) { 
    this.form = this.fb.group({
      name:        [null,  Validators.compose([Validators.required])],
      slug:        [null,  Validators.compose([Validators.required])],
      description: [null],
    });


  }


  // ****** LOAD ******************
  fetchEntity(id){
    this.modelId = id;
    this.folderService.getFolder(this.modelId)
      .then(entity => {
        if(!entity){

        }
        else {
          this.model = entity
          this.form.reset({
            name:         this.model.name,
            slug:         this.model.slug,
            description:  this.model.description,
          });
          // ToDo seguir la variable relatecards
        }
      })
      .catch(err => console.log(err));
  }

  ngOnInit() {
    this.fetchEntity(this.route.snapshot.paramMap.get('id'));
  }




  // ****** SAVE ******************
  saveRecord(){
    this.model = initForSave(this.form, this.model);
    return this.folderService.update(this.model).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });
  }

  continueEditing(model){
    this.model = model;
    this.formReset(this.model);
  }

  saveAndGo(){
    this.saveRecord().then(model =>{
        this.closeEditor(LIST);
    })
  }

  closeEditor(target){
    this.router.navigate([target]);
  }

  editCancel(){
    this.closeEditor(LIST);
  }

  onSubmit() {
    this.saveRecord().then(model =>{
        this.continueEditing(model);
    })
  }
  // ******  END SAVE ******************


  formReset(model){
    this.form.reset({
      name:       model.name,
      slug:         model.slug,
      cardCategory: model.cardCategory,
      description:  model.description,
    })
  }

  changeCardType(){

  }

  descriptionUpdateContent(content){

  }

  initNewModel(){
    this.model = folderModel.initNewFolder('','',null,null);
    this.model.name = '';
    this.model.slug = '';
    this.model.description = '';
  }

  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {
      duration: 3000,
    });

    snck.onAction().subscribe((e)=> {

    })
  }

}
