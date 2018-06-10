import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Subject } from 'rxjs';

import { Asset } from '../develar-entities';

const URL = 'api/upload/assetupload';

@Component({
  selector: 'assets-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
	@Output() assetUpload = new EventEmitter<Subject<Asset>>();
	@Output() externalAsset = new EventEmitter<Subject<string>>()

	public uploader:FileUploader = new FileUploader({url: URL});

	public hasBaseDropZoneOver:boolean = false;
	public hasAnotherDropZoneOver:boolean = false;
	private assetSubject = new Subject<Asset>();
	private externalAssetSubject = new Subject<string>();

	public fileOverBase(e:any):void {
	  this.hasBaseDropZoneOver = e;
	}

	public fileOverAnother(e:any):void {
	  this.hasAnotherDropZoneOver = e;
	}


  constructor() { 

  }

  ngOnInit() {
		this.assetUpload.emit(this.assetSubject);
		this.externalAsset.emit(this.externalAssetSubject);

  	this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
			let asset = JSON.parse(response) as Asset;
			this.assetSubject.next(asset);
		};


  }
  
  fireExternalAsset(url){
  	this.externalAssetSubject.next(url);
  }

}
