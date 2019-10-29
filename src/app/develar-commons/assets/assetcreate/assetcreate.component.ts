import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators }  from 'ng2-validation';
import { Router }            from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Observable ,  Subject } from 'rxjs';

import { AssetService }    from '../../asset.service';
	
import { Asset, assetModel }    from '../../develar-entities';

const DEVELAR = 'localhost:8080/'

function initForSave(form: FormGroup, model: Asset): Asset {
	const fvalue = form.value;

  model.assetId    = fvalue.cardId;
  model.slug       = fvalue.slug;
	model.path    = fvalue.path;
	model.mimetype       = fvalue.mimetype;
	model.size        = fvalue.size;
  model.description = fvalue.description;

	return model;
};


@Component({
  selector: 'asset-create',
  templateUrl: './assetcreate.component.html',
  styleUrls: ['./assetcreate.component.scss']
})
export class AssetcreateComponent implements OnInit {
	pageTitle: string = 'Alta nueva ficha';
  @Input() private entityId: string;
  @Input() private entityName: string;
  @Output() private assetEmitted = new EventEmitter<Asset>();
	public form: FormGroup;
	public model: Asset;
	assets: Asset[] = [];
	public assetTypes = [];


  constructor(
  	private fb: FormBuilder,
  	private assetService: AssetService,
    private router: Router,
    public snackBar: MatSnackBar,

  	) { 
    this.form = this.fb.group({
      assetId:     [null,  Validators.compose([Validators.required])],
      slug:        [null,  Validators.compose([Validators.required])],
      path:     [null,  Validators.compose([Validators.required])],
      description: [null,  Validators.compose([Validators.required])],
      mimetype:        [null],
      size:        [null],
    });
  }

  ngOnInit() {
    this.initNewModel();
    this.formReset(this.model);
    this.assetTypes = assetModel.getAssetTypes();
  }

  assetUpload(loader: Subject<Asset>){
    loader.subscribe(asset =>{
      this.assets.unshift(asset);

    })
  }

  addExternalAsset(loader: Subject<Asset>){
    loader.subscribe(url =>{
      let asset = assetModel.initNewExternalAsset(url);
      this.assets.unshift(asset);

    })
  }


  assetSearch(asset: Asset){
      this.assets.unshift(asset);
  }

	selectedAsset(asset: Asset){
	}

	editAsset(asset: Asset){
	}
  
  assetToPromote(asset: Asset){
    this.assetEmitted.emit(asset);
  }


  saveNewRecord(){
    this.model = initForSave(this.form, this.model);
    return this.assetService.create(this.model).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });
  }

  continueEditing(model){
    this.model = model;
    delete this.model._id;
    this.formReset(this.model);
  }

  onSubmit() {
    this.saveNewRecord().then(model =>{
        this.continueEditing(model);
    })
  }

  saveAndEdit(){
    this.saveNewRecord().then(model =>{
        this.closeEditor('/libreria/editarficha/' + model._id);
    })
  }

  saveAndGo(){
    this.saveNewRecord().then(model =>{
        this.closeEditor('/libreria/lista');
    })
  }

	getNormalizedPath(path){
		return DEVELAR + path;
	}

  formReset(model){
    this.form.reset({
      assetId:       model.assetId,
      slug:         model.slug,
      path:         model.path,
      mimetype:     model.mimetype,
      size:        model.size,
      description:  model.description,
    })
  }

  changeCardType(){
  }

  descriptionUpdateContent(content){
  }

  initNewModel(){
    this.model = new Asset('');
    this.model.description = '';
  }

  closeEditor(target){
    this.router.navigate([target]);
  }

  editCancel(){
    this.closeEditor('/libreria/lista');
  }

  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {
      duration: 3000,
    });

    snck.onAction().subscribe((e)=> {
    })
  }

}
