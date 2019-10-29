import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Subject } from 'rxjs';

import { AssetFile } from '../../develar-entities';

const URL = 'api/upload/updatefile';

@Component({
  selector: 'file-update',
  templateUrl: './updatefile.component.html',
  styleUrls: ['./updatefile.component.scss']
})
export class UpdatefileComponent implements OnInit {
	@Output() fileUpdated = new EventEmitter<Subject<AssetFile>>();

	public uploader:FileUploader = new FileUploader({url: URL});

	public hasBaseDropZoneOver:boolean = false;
	public hasAnotherDropZoneOver:boolean = false;
	private fileSubject = new Subject<AssetFile>();

	public fileOverBase(e:any):void {
	  this.hasBaseDropZoneOver = e;
	}

	public fileOverAnother(e:any):void {
	  this.hasAnotherDropZoneOver = e;
	}


  constructor() { 

  }

  ngOnInit() {
		this.fileUpdated.emit(this.fileSubject);

  	this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
			let asset = JSON.parse(response) as AssetFile;
			this.fileSubject.next(asset);
		};


  }

}
