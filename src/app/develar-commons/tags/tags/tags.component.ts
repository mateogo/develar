import { Component, OnInit, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatChipInputEvent, MatChipEvent, MatChipSelectionChange, MatChipListChange } from '@angular/material/chips';

import { Observable ,  Subject, of }        from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap }   from 'rxjs/operators';

import { DaoService } from '../../dao.service';

import { Tag } from '../../develar-entities';

const COMMA = 188;
const ENTER = 13;
const TAB = 9;

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagComponent implements OnInit {
	@Output() emitTags = new EventEmitter<Tag[]>();
  @Input() taglist = [];
  @Input() parentCol:string = "";
  @Input() parentType:string = "";
  @Input() parentStype:string = "";
  
	models: Observable<Tag[]>;
	searchTerms = new Subject<any>();
	

	separatorKeysCodes =  [ENTER, COMMA, TAB];
	removable: boolean   = true;
	visible: boolean     = true;
	selectable: boolean  = true;
	multiple: boolean = false;
	addOnBlur: boolean   = true;
	

  buildQuery(slug, col, type, stype){
    let q = {};

    if(slug){
      q['name'] = slug;
    }

    if(col){
      q['parentCol'] = col;     
    }

    if(type && type !== 'no_definido'){
      q['parentType'] = type;     
    }

    if(stype && stype !== 'no_definido'){
      q['parentStype'] = stype;     
    }

    return q;
  }



  constructor(
  	private daoService: DaoService,
  	private router: Router
  	) { }

  ngOnInit() {

  	this.models = this.searchTerms
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(t => t && t.length >2 && !(/[^a-z0-9,ñ\s]+/ig.test(t))),
        switchMap(term => term
           ? this.daoService.search<Tag>('tag', term)
           : of<Tag[]>([])
          )
      );

    this.models.subscribe(models => {
    })

  }

  promoteTags(){
    this.emitTags.emit(this.taglist);
  }

  @HostListener('mouseleave') onMouseLeave() {
      this.promoteTags();
  }

  @HostListener('blur') onBlur() {
      this.promoteTags();
  }


  addNewToken(term ){
    if(this.taglist.indexOf(term) === -1){
      this.taglist.push(term);
      this.promoteTags();
    }
  }

  search(e, term: string):void{
    let query = this.buildQuery(term, this.parentCol, this.parentType, this.parentStype);
  	this.searchTerms.next(query);
  }

	add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    if ((value || '').trim()) {
      this.addNewToken(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  selectEntity(model:Tag, ifld){
    this.addNewToken(model._id);
    ifld.value = "";
  }

  remove(token: any): void {
    let index = this.taglist.indexOf(token);

    if (index >= 0) {
      this.taglist.splice(index, 1);
      this.promoteTags();
    }
  }
}
