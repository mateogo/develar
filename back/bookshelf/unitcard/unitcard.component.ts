import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators }  from 'ng2-validation';

import { Subject }      from 'rxjs';

import { Router, ActivatedRoute }            from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { RecordCard, SubCard, cardHelper }    from '../recordcard';
import { CardGraph, graphUtilities } from '../cardgraph.helper';

import { RecordCardService } from '../bookshelf.service';
import { SharedService } from '../../develar-commons/shared-service';
import { UserService }   from '../../entities/user/user.service';
import { User }   from '../../entities/user/user';

function initForSave(form: FormGroup, model: RecordCard, resources:CardGraph[], user: User ): RecordCard {
	const fvalue = form.value;

  model.cardId      = fvalue.cardId;
  model.cardType    = fvalue.cardType;
  model.cardCategory = fvalue.cardCategory;
  model.topic       = fvalue.topic;
  model.slug        = fvalue.slug;
  model.description = fvalue.description;
  model.mainimage   = fvalue.mainimage;
  model.resources   = resources;
  model.communitylist = [user.communityId];
  model.userId = user._id;
  model.user = user.username;

	return model;
};
const BROWSE = 'lista'


@Component({
  selector: 'app-unitcard',
  templateUrl: './unitcard.component.html',
  styleUrls: ['./unitcard.component.scss']
})
export class UnitcardComponent implements OnInit {
	pageTitle: string = 'Alta nueva ficha';
	public form: FormGroup;
	public model: RecordCard;
  private cardtypes = cardHelper.cardTypes;
  private cardcategories = cardHelper.cardCategories;

  private currentUser: User;

  // valores default para el medium-editor para campo descripción
  public meContent: string = '';
  public mePlaceholder: string = 'Descripción';

  public resourceList: CardGraph[] = [];
  public addCardToList = new Subject<CardGraph>();


  constructor(
  	private fb: FormBuilder,
  	private recordcardService: RecordCardService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    public snackBar: MatSnackBar,
    private _sharedService: SharedService


  	) { 
    this.form = this.fb.group({
      cardId:      [null,  Validators.compose([Validators.required])],
      slug:        [null,  Validators.compose([Validators.required])],
      cardType:    [null],
      topic:       [null],
      cardCategory:[null],
      description: [null,  Validators.compose([Validators.required])],
      mainimage:   [null],
    });
    this._sharedService.emitChange(this.pageTitle);


  }

  ngOnInit() {
    this.initNewModel();
    this.formReset(this.model);
  }

  saveNewRecord(){
    this.model = initForSave(this.form, this.model, this.resourceList, this.currentUser);
    return this.recordcardService.create(this.model).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });
  }

  continueEditing(model){
    console.log('Continue editing: [%s] [%s] [%s]', model.slug, model._id, model.id);
    this.model = model;
    delete this.model._id;
    this.formReset(this.model);
  }

  onSubmit() {
    this.saveNewRecord().then(model =>{
        console.log('onSubmit: Entidad creada: [%s] [%s] [%s]', this.model.slug, this.model._id, this.model.id)
        this.continueEditing(model);
    })
  }

  saveAndEdit(){
    this.saveNewRecord().then(model =>{
        console.log('Save&GO: Entidad creada: [%s] [%s] [%s]', this.model.slug, this.model._id, this.model.id)
        this.router.navigate(['../', 'editar', model._id ], {relativeTo: this.route});
    })
  }

  saveAndGo(){
    this.saveNewRecord().then(model =>{
        console.log('Save&GO: Entidad creada: [%s] [%s] [%s]', this.model.slug, this.model._id, this.model.id)
        this.closeEditor(BROWSE);
    })
  }

  formReset(model){
    this.form.reset({
      cardId:       model.cardId,
      slug:         model.slug,
      cardType:     model.cardType,
      topic:        model.topic,
      cardCategory: model.cardCategory,
      description:  model.description,
      mainimage:    model.mainimage,
    })
  }

  changeCardType(){
    console.log('cartType CHANGED');
  }

  descriptionUpdateContent(content){
    console.log("BUBBBBBLED: [%s]", content);
  }

  initNewModel(){
    this.model = new RecordCard('');

    this.currentUser = this.userService.currentUser;
    if(!this.userService.userlogged){
       this.openSnackBar('Su sesión no está activa. Debe ingresar para dara alta de fichas', 'cerrar');
    }


    this.model.cardType = 'ficha';
    this.model.cardCategory = 'documento';
    this.model.cardId = 'F-01-01';
    this.model.topic = 'general';
    this.model.description = '';
  }

  googleAdapter(model, data){
    model.slug = data.title || model.slug;
    model.description = data.snippet || model.description;
    model.mainimage = data.link || model.mainimage;
    model.subtitle = data.formattedUrl || model.subtitle;
  }

  createCardGraphFromGoogle(data){
    let card = graphUtilities.cardGraphFromGoogleSearch('resource', data, 'enlace');
    this.addCardToList.next(card);
  }

  closeEditor(target){
    this.router.navigate(['../'], {relativeTo: this.route});
  }

  editCancel(){
    this.closeEditor(BROWSE);
  }

  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {
      duration: 3000,
    });

    snck.onAction().subscribe((e)=> {
      console.log('action???? [%s]', e);
    })
  }

}



//import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
