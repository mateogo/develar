import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { gldef } from './develar.config';

@Injectable()
export class SharedService {
  // Observable string sources
  private emitChangeSource = new Subject();
  private homeViewSource =  new BehaviorSubject<boolean>(true);


  // Observable string streams
  public changeEmitted$ = this.emitChangeSource.asObservable();
  public isHomeViewEmitted$ = this.homeViewSource.asObservable();

  // Service message commands
  emitChange(change: string) {
    this.emitChangeSource.next(change);
  }

  homeView(isHomeView: boolean){
    this.homeViewSource.next(isHomeView);
  }

  get gldef(){
  	return gldef;
  }

}