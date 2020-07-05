import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators }  from 'ng2-validation';
import { Router }            from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

import { AssetService }    from '../../asset.service';
	
import { Asset, AssetFile, assetModel }    from '../../develar-entities';

import { Subject } from 'rxjs';

const IMG_MIMETYPS = [
  'image/jpeg',
  'image/jpg',
  'image/gif',
  'image/png',
];


function initForSave(form: FormGroup, model: Asset): Asset {
	const fvalue = form.value;

  model.assetId    = fvalue.assetId;
  model.slug       = fvalue.slug;
	model.path       = fvalue.path;
  model.description = fvalue.description;

	return model;
};


@Component({
  selector: 'asset-edit',
  templateUrl: './assetedit.component.html',
  styleUrls: ['./assetedit.component.scss']
})
export class AsseteditComponent implements OnInit {
	@Input() selectedAsset: Asset;
  @Output() assetEmitted = new EventEmitter<Asset>();


  pageTitle: string = 'edición de asset';

	public form: FormGroup;
	public model: Asset;
  public files = [];
	private assets: Asset[] = [];
	public assetTypes = [];
  public openEditor = false;


  constructor(
  	private fb: FormBuilder,
  	private assetService: AssetService,
    private router: Router,
    public snackBar: MatSnackBar,

  	) { 
    this.form = this.fb.group({
      assetId:     [null,  Validators.compose([Validators.required])],
      slug:        [null,  Validators.compose([Validators.required])],
      path:        [null,  Validators.compose([Validators.required])],
      description: [null],
    });
  }

  ngOnInit() {
    if(!this.selectedAsset){
      this.initNewModel();
    }else {
      this.initModel()
    }

    this.formReset(this.model);
    this.assetTypes = assetModel.getAssetTypes();
  }


  saveNewRecord(){
    this.model = initForSave(this.form, this.model);
    return this.assetService.create(this.model).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });
  }

  saveRecord(){
    this.model = initForSave(this.form, this.model);
    return this.assetService.update(this.model).then((model) =>{
              this.openSnackBar('Grabación exitosa id: ' + model._id, 'cerrar');
              return model;
            });
  }

  onSubmit() {
    if(this.model._id){
      this.saveRecord().then(model =>{
          this.editAsset()
      })

    }else{
      this.saveNewRecord().then(model =>{
          this.editAsset()
      })
    }

  }


  assetUpload(loader: Subject<Asset>){
  	loader.subscribe(asset =>{
  		this.assets.unshift(asset);

  	})
  }
  isImage(){
    let type = this.model.mimetype;
    let isImage = IMG_MIMETYPS.indexOf(type) !== -1 ? true: false;
    return isImage;

  }
  
  selectAsset(asset: Asset){
    this.assetEmitted.emit(asset)
  }

  editAsset(){
    this.openEditor = !this.openEditor;
    if(this.openEditor){
      this.formReset(this.model);
    }

  }

  formReset(model){
    this.form.reset({
      assetId:       model.assetId,
      slug:         model.slug,
      path:         model.path,
      description:  model.description,
    })
  }

  initNewModel(){
    this.model = new Asset('');
    this.model.description = '';
  }

  initModel(){
    this.model = this.selectedAsset;
    this.files = this.model.files;
  }

  closeEditor(target){
    //this.router.navigate([target]);
  }

  editCancel(){
    //this.closeEditor('/libreria/lista');
  }

  fileUpdated(loader: Subject<AssetFile>){
    loader.subscribe(file =>{
      this.files.unshift(file);
      this.updateAsset(file)
    })
  }
  
  promoteFile(file){
    this.updateAsset(file)
  }


        // assetId: file.originalname,
        // path: file.path,
        // isUploaded: true,

        // slug: file.originalname,
        // filename: file.filename,
        // description: '',
        // server: 'develar',
    
        // originalname: file.originalname,
        // encoding: file.encoding,
        // mimetype: file.mimetype,
        // size: file.size,
        // upload: file.upload,


  updateAsset(file){
    this.model = initForSave(this.form, this.model);

    this.model.path = file.path;
    this.model.filename = file.filename;
    this.model.originalname = file.originalname ;
    this.model.encoding = file.encoding ;
    this.model.size = file.size ;
    this.model.mimetype = file.mimetype ;
    this.model.upload = file.upload ;

    this.formReset(this.model);

  }

  openSnackBar(message: string, action: string) {
    let snck = this.snackBar.open(message, action, {
      duration: 3000,
    });

    snck.onAction().subscribe((e)=> {
    })
  }

}



//import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
