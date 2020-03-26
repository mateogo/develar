import { Injectable } from '@angular/core';

import { BehaviorSubject ,  Subject ,  Observable } from 'rxjs';

import { DaoService } from '../develar-commons/dao.service';

import { Community } from '../develar-commons/community/community.model';
import { RecordCard } from '../site-minimal/recordcard.model';


@Injectable({
  providedIn: 'root'
})
export class BookshelfController {

  private readonly recordtype = 'notification'

  //Site state properties
  private naviCmty: CommunityToken = new CommunityToken();
  private userCmty: CommunityToken = new CommunityToken();

  private navigationUrl = "";



	constructor(
		private daoService: DaoService,
		) { }



  ////************* API ************////
  ////          recordcard         ////
  ////************* API **********////
  fetchRecordsByQuery(query): Observable<RecordCard[]> {
    return this.daoService.search<RecordCard>('recordcard', query);
  }

  fetchContextRecords(topic): Subject<RecordCard[]>{
    let listener = new Subject<RecordCard[]>();

    let communityFinder = new Subject<CommunityToken>();

    communityFinder.subscribe(commty =>{
      if(commty.isActive){
        this.fetchRecords(topic, listener);
      }
    });

    this.fetchCurrentCommunity(communityFinder);

    return listener;
  }

  private fetchRecords(topic:string, recordEmitter:Subject<RecordCard[]>){
    let query = {
      communityId: this.naviCmty.id,
      publish: true,
      'publish.tag': topic,
    }

    this.daoService.search<RecordCard>('recordcard', query).subscribe(tokens =>{
      if(tokens){
        recordEmitter.next(tokens)

      }else{
        recordEmitter.next([]);
      }

    });
  }

  private fetchCurrentCommunity(commtyListener: Subject<CommunityToken>){

    if(this.navigationUrl){
      this.loadCommunityFromDb(this.navigationUrl, commtyListener);

    }else if(this.naviCmty.isActive){
      commtyListener.next(this.naviCmty);

    }else{
      this.fetchDefaultCommunityFromDB(commtyListener);
    } 

  }

  private fetchDefaultCommunityFromDB(commtyListener: Subject<CommunityToken>){
    this.naviCmty.isActive = false;
    this.naviCmty.isLoading = true;
    this.daoService.search<Community>('community', {eclass: 'home'}).subscribe(records => {
      this.naviCmty.isLoading = false;

      if(records && records.length){
        this.setCurrentCommunityData(records[0]);
      }
      commtyListener.next(this.naviCmty);
    });
  }
 
  private loadCommunityFromDb(url:string, commtyListener: Subject<CommunityToken>){
    if(url){
      this.naviCmty.isActive = false;
      this.naviCmty.isLoading = true

      this.daoService.search<Community>('community', {urlpath: url}).subscribe(records => {
        this.naviCmty.isLoading = false;

        if(records && records.length){
          this.setCurrentCommunityData(records[0]);
        }

        commtyListener.next(this.naviCmty);

      })
    }
  }

  private setCurrentCommunityData(entity: Community){

    this.naviCmty.data = entity;
    this.naviCmty.id = entity._id;
    this.naviCmty.isActive = true;
    this.naviCmty.isLoading = false;
    this.naviCmty.url = entity.urlpath;
    this.naviCmty.userOwned = false;

    if(this.naviCmty.id === this.userCmty.id){
      this.naviCmty.userOwned = true;

    }

  }



}

class CommunityToken {
  isActive: boolean = false;
  isLoading: boolean = false;
  userOwned: boolean = false;
  renderTopic: string = "";
  id: string = "";
  url: string = "";
  data: Community;
}

