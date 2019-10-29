import { Component, OnInit, Input, Output, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { BasicData }    from '../base.model';
import { Tag } from '../develar-entities';


import { Subject } from 'rxjs';

function fetchData(form: FormGroup, model: BasicData): BasicData {
	const fvalue = form.value;
  model.name      = fvalue.name;
  model.slug    = fvalue.slug;
  model.description = fvalue.description;

	return model;
};

@Component({
  selector: 'note-base',
  templateUrl: './note-base.component.html',
  styleUrls: ['./note-base.component.scss']
})
export class NoteBaseComponent implements OnInit {
	@Input()
		get noteBase(){
			return this.model;
		}
		set noteBase(model){
			this.model = model;
      this.tags = model.taglist;
		}


	pageTitle: string = 'Alta nueva carpeta';

	public form: FormGroup;
  public openEditor = false;


  // valores default para el medium-editor para campo descripción

  // valores default para el medium-editor para campo descripción
  public meContent: string = '';
  public mePlaceholder: string = 'Descripción';


  private status = false;
  public model: BasicData;
  public tags = [];

  @HostListener('mouseleave') onMouseLeave() {
      this.promoteData();
  }

  @HostListener('blur') onBlur() {
      this.promoteData();
  }



  constructor(
  	private fb: FormBuilder,
  	) { 
    this.form = this.fb.group({
      name:        [null,  Validators.compose([Validators.required])],
      slug:        [null,  Validators.compose([Validators.required])],
      description: [null],
    });


  }

  ngOnInit() {
  	if(this.model){

	    this.initNewModel();
	    this.formReset(this.model);
  	}
  }

  // ****** PROMOTE ******************
  promoteData(){

    this.model = fetchData(this.form, this.model);

  }
  // ******  END PROMOTE ******************


  initNewModel(){
  }

  formReset(model){
    this.form.reset({
      name:       model.name,
      slug:         model.slug,
      description:  model.description,
    })
  }

  addTags(tags){
    this.model.taglist = tags;
    this.tags = tags;
  }

  editToken(){
    if(this.openEditor){
      this.promoteData();
    }
    this.openEditor = !this.openEditor;
  }

  descriptionUpdateContent(content){
  }


}
