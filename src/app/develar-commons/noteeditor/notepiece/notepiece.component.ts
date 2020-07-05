import { Component, OnInit, Input,AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { NotePiece, noteModel } from '../note-model';

import { PrismHighlightService } from '../../highlighter.service';

@Component({
  selector: 'notepiece',
  templateUrl: './notepiece.component.html',
  styleUrls: ['./notepiece.component.scss']
})
export class NotepieceComponent implements OnInit {
  @Input() notePiece: NotePiece

  public form: FormGroup;
  public meContent: string = '';
  public mePlaceholder: string = 'Descripción';
  public typeList = noteModel.typeList;
  public selectedType: string = '';
  public title:string = '';
  public subtitle:string = '';

  public editMode = true;
  public userMode = false;
  public colapsedMode = false;
  public compiledMode = false;
  public isPrismed = false;


  constructor(
  		private fb: FormBuilder,
      private hlSrv: PrismHighlightService,

  	) {

			this.form = this.fb.group({
    		description:  [null, Validators.compose([Validators.required])],
        type:         [null, Validators.compose([Validators.required])],
        header:       [null],
        sheader:      [null],
        todo:         [null],
        vclass:       [null],
  	  });

   }

  ngOnInit() {
  	this.initEditor();
  }

  initEditor(){
    this.title = this.notePiece.header;
    this.subtitle = this.notePiece.sheader;

		this.form.reset({
		  description:  this.notePiece.raw,
      type:    this.notePiece.type,
      vclass:  this.notePiece.vclass,
      header:  this.notePiece.header,
      sheader: this.notePiece.sheader,
      todo:    this.notePiece.todo,
		});


  }
	
	changeType(e: MatSelectChange){
		this.selectedType = e.value;
	}

  descriptionUpdateContent(content){
  }
  
  turnOff(){
    this.editMode = false;
    this.colapsedMode = false;
    this.compiledMode = false;
    this.userMode = false;
    setTimeout(() => {
      this.isPrismed = false;
      this.ngAfterViewChecked();
    },100);

  }

  editView(e){
    e.preventDefault();
    this.turnOff()
    this.editMode = true;
  }

  compileView(e){
    e.preventDefault();
    this.turnOff()
    this.compiledMode = true;
  }

  colapsedView(e){
    e.preventDefault();
    this.turnOff()
    this.colapsedMode = true;
  }

  userView(e){
    e.preventDefault();
    this.turnOff()
    this.userMode = true;
  }

  ngAfterViewChecked() {
    if(this.notePiece && !this.isPrismed){
      this.hlSrv.highlightAll();
      this.isPrismed = true;
    }
  }


}
