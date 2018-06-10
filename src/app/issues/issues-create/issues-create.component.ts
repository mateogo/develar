import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, UrlSegment } from '@angular/router';

import { Subject } from 'rxjs';

import { IssuesController } from '../issues-controller.service';
import { Issue } from '../issues-model';


@Component({
  selector: 'issues-create',
  templateUrl: './issues-create.component.html',
  styleUrls: ['./issues-create.component.scss']
})
export class IssuesCreateComponent implements OnInit {

	public entity: Issue;
	public form;

	public _openEditor = true;

  public meContent = "";
  public mePlaceholder = "Descripción del reclamo";


  constructor(
  		private fb: FormBuilder,
  		private route: ActivatedRoute,
  		private iCtrl: IssuesController
  	) { 
    this.form = this.fb.group({
      issueId:     [null,  Validators.compose([Validators.required])],
      title:       [null,  Validators.compose([Validators.required])],
      description: [null],
      reportedBy:  [null],
      user:        [null,  Validators.compose([Validators.required])],
    });


  }

  ngOnInit() {
  	this.initNewIssue();
  	//console.log('init New Issue ');
  	console.log('init New Issue: [%s]', this.entity.title);

  }
  initNewIssue(){
  	this.entity = this.iCtrl.initNewIssue({
  		title:'HelloWorld'
  	});
  }

  formReset(issue: Issue){
  	this.form.reset({
  		issuedId: issue.issueId,
  		title: issue.title,
  		description: issue.description,
  		reportedBy: issue.reportedBy
  	});


  }
  // medium editor content Update
	contentUpdateContent(data){
		console.log('updateContent')
	}

  editCancel(){
    this._openEditor = false;

  }

	onSubmit(){
		console.log('onSubmit');
	}


}
