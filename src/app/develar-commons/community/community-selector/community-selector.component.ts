import { Component, OnInit, EventEmitter,Input, Output, HostListener } from '@angular/core';

import { MatChipInputEvent, MatChipEvent,MatChipSelectionChange, MatChipListChange} from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/switchMap'

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
  			.debounceTime(300)
  			.distinctUntilChanged()
  			.switchMap(term => term
  				? this.daoService.search<Community>(this.recordType, term)
  				: Observable.of<Community[]>([])
  			)
  			.catch(error => {
  				return Observable.of<Community[]>([]);
  			});
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
    let query = this.communityCtrl.searchQuery(term);
  	this.searchTerms.next(query);
  }

	add(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    if ((value || '').trim()) {
      //this.addNewToken(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  selectEntity(model:Community, ifld){
    console.log('Entity Selected from DB:[%s]', model._id, ifld.value);
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


