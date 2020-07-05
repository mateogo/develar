import { Component, OnInit, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatChipInputEvent, MatChipEvent, MatChipSelectionChange, MatChipListChange } from '@angular/material/chips';

import { Observable ,  Subject ,  BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap }   from 'rxjs/operators';

import { DaoService } from '../../../../develar-commons/dao.service';

import { User } from '../../user';

const COMMA = 188;
const ENTER = 13;
const TAB = 9;

@Component({
  selector: 'user-chip',
  templateUrl: './user-chip.component.html',
  styleUrls: ['./user-chip.component.scss']
})
export class UserChipComponent implements OnInit {
  @Input()  users: BehaviorSubject<string[]>;
  @Input()  inputlabel = 'seleccione usuarios...'


	@Output() emitUsers = new EventEmitter<User[]>();

	models: Observable<User[]>;
  userlist: User[] = [];

	searchTerms = new Subject<any>();
	
	separatorKeysCodes =  [ENTER, COMMA, TAB];
	removable  = true;
	visible    = true;
	selectable = true;
	addOnBlur  = true;
  multiple   = true;
	

  buildQuery(data){
    let q = {};

    if(data['email']){
      q['email'] = data['email'];
    }

    if(data['username']){
      q['username'] = data['username'];
    }

    return q;
  }


  constructor(
  	private daoService: DaoService,
  	private router: Router
  	) { }

  ngOnInit() {
    if(this.users){
      this.users.subscribe(useridList => {
        if(useridList && useridList.length>0){
          this.daoService.search<User>('user', {users: useridList}).subscribe(tokens =>{
            this.userlist = tokens;
          })
        }


      })
    }

  	this.models = this.searchTerms
      .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(term =>
            this.daoService.search<User>('user', term))

      );

    this.models.subscribe(models => {
    })

  }

  promoteUsers(){
    this.emitUsers.emit(this.userlist);
  }

  @HostListener('mouseleave') onMouseLeave() {
      this.promoteUsers();
  }

  @HostListener('blur') onBlur() {
      this.promoteUsers();
  }

  selectionChange(e:MatChipSelectionChange){
    // let s = e.source;
    // //s.toggleSelected() 
  }


  addNewToken(token: User ){
    if(!this.userlist.find(tk => tk._id === token._id)){
      this.userlist.push(token);
      this.promoteUsers();      
    }
  }

  search(e, term: string):void{
    
    if(!(term && term.trim())){
      return;
    }

    let query = this.buildQuery({email: term});
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

  selectEntity(model:User, ifld){
    this.addNewToken(model);
    ifld.value = "";
  }

  remove(token: User): void {
    let index = this.userlist.indexOf(token);

    if (index >= 0) {
      this.userlist.splice(index, 1);
      this.promoteUsers();
    }
  }
}

//        [matChipInputAddOnBlur]='addOnBlur'


