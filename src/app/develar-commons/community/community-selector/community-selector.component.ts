import { Component, OnInit, EventEmitter,Input, Output, HostListener } from '@angular/core';

import { MatChipInputEvent, MatChipEvent, MatChipSelectionChange, MatChipListChange } from '@angular/material/chips';

import { Observable ,  Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap }   from 'rxjs/operators';

import { DaoService } from '../../dao.service';

import { CommunityController }    from '../community.controller';

import { Community, communityModel }    from '../community.model';


const COMMA = 188;
const ENTER = 13;
const TAB = 9;

@Component({
  selector: 'community-selector',
  templateUrl: './community-selector.component.html',
  styleUrls: ['./community-selector.component.scss']
})
export class CommunitySelectorComponent implements OnInit {
	@Output() emitEntities = new EventEmitter<Community[]>();
  @Input() entityList: Community[] = [];

  @Input() parentCol:string = "";
  @Input() parentType:string = "";
  @Input() parentStype:string = "";
  
	models: Observable<Community[]>;
	searchTerms = new Subject<any>();
	private recordType = 'community';

	separatorKeysCodes =  [ENTER, COMMA, TAB];
	removable: boolean   = true;
	visible: boolean     = true;
	selectable: boolean  = true;
	multiple: boolean = false;
	addOnBlur: boolean   = true;
	

  constructor(
  	private daoService: DaoService,
  	private communityCtrl: CommunityController
  	) { }

  ngOnInit() {

  	this.models = this.searchTerms
      .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(term => this.daoService.search<Community>(this.recordType, term))        
        )
  }

  promoteEntities(){
    this.emitEntities.emit(this.entityList);
  }

  @HostListener('mouseleave') onMouseLeave() {
      this.promoteEntities();
  }

  @HostListener('blur') onBlur() {
      this.promoteEntities();
  }


  addNewToken(token ){
    if(!this.entityList.find(tk => tk._id === token._id)){
      this.entityList.push(token);
      this.promoteEntities();      
    }
  }

  search(e, term: string):void{
    if(!term.trim()) return;
    let query = this.communityCtrl.searchQuery(term);
  	this.searchTerms.next(query);
  }

	add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    if ((value || '').trim()) {

    }

    if (input) {
      input.value = '';
    }
  }

  selectEntity(model:Community, ifld){
    this.addNewToken(model);
    ifld.value = "";
  }

  remove(token: any): void {
    let index = this.entityList.indexOf(token);

    if (index >= 0) {
      this.entityList.splice(index, 1);
      this.promoteEntities();
    }
  }
}


