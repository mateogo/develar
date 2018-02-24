import { Component, OnInit, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { MatChipInputEvent, MatChipEvent, MatChipSelectionChange, MatChipListChange} from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/switchMap'

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
	removable: boolean  = true;
	visible:   boolean = true;
	selectable: boolean  = true;
	multiple:  boolean = false;
	addOnBlur: boolean = true;
	

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
      console.log('users subscribed!!!!')
      this.users.subscribe(useridList => {
        console.log('users receiving emitter, ready to fetch dao service')
        if(useridList && useridList.length>0){
          this.daoService.search<User>('user', {users: useridList}).subscribe(tokens =>{
            console.log('userlist UPDATED from daoservice')
            this.userlist = tokens;
          })
        }


      })
    }

  	this.models = this.searchTerms
  			.debounceTime(300)
  			.distinctUntilChanged()
  			.switchMap(query => query
  				? this.daoService.search<User>('user', query)
  				: Observable.of<User[]>([])
  			)
  			.catch(error => {
  				return Observable.of<User[]>([]);
  			});

    this.models.subscribe(models => {
      //console.log('SUBSCRIBE okkkkkkkkkkkkk', models.length);
    })

  }

  promoteUsers(){
  	console.log('promoteUsers')
    this.emitUsers.emit(this.userlist);
  }

  @HostListener('mouseleave') onMouseLeave() {
      this.promoteUsers();
  }

  @HostListener('blur') onBlur() {
      this.promoteUsers();
  }


  addNewToken(token: User ){
    if(!this.userlist.find(tk => tk._id === token._id)){
      this.userlist.push(token);
      this.promoteUsers();      
    }
  }

  search(e, term: string):void{
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

  remove(token: any): void {
    let index = this.userlist.indexOf(token);

    if (index >= 0) {
      this.userlist.splice(index, 1);
      this.promoteUsers();
    }
  }
}

//        [matChipInputAddOnBlur]='addOnBlur'


