import { Component, OnInit, OnDestroy, Input, Output, OnChanges, HostListener, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject } from 'rxjs';

import { devutils } from '../../develar-commons/utils';

import { NotificationController }    from '../notification.controller';

import { UserConversation, ConversationContext, ConversationTable, MessageToken }    from '../notification.model';

const whoami = "ntofication management component"

@Component({
  selector: 'notification-manage',
  templateUrl: './notification-manage.component.html',
  styleUrls: ['./notification-manage.component.scss']
})
export class NotificationManageComponent implements OnInit, OnChanges, OnDestroy {
  @Input() context$: BehaviorSubject<ConversationContext>;

	
	public _openEditor: boolean = false;
	private _editable: boolean = true;
  private _editMany: boolean = false;
  private _editorTitle = "Gesión de Mensajes";
  private _modelSbscrptn;
  private _recordtype = 'notification';

	private userconver: UserConversation;
  private userconverId: string;
  private userconverEditList: UserConversation[];

  private conversations: UserConversation[] = [];

  public showTable = false;
  public showEditor = false;
  public context: ConversationContext;


  constructor(
      private notifCtrl: NotificationController,
      private router: Router
    ) { }

  ngOnDestroy(){
    this._modelSbscrptn.unsubscribe()

  }

  ngOnChanges(){
    //console.log('ngOnChanges;')
  }

  ngOnInit() {
    this._modelSbscrptn = this.notifCtrl.userconversationListener.subscribe(entity =>{
      this.initEntityData(entity);
      this.userconver = entity;
    })


    this.notifCtrl.initUserConversation(this.userconver, this.userconverId);

    if(this.context$){
      this.context$.subscribe(data =>{
        this.context = data;
        this.updateTableList();
      });

    }else {
      this.updateTableList();
    }

  }


  updateSelRecords(list: ConversationTable[]){
    //console.log('updateSelRecords:[%s]', list.length)
  }

  updateTableList(){
    this.notifCtrl.fetchUserConversations(this.context);
    setTimeout(()=>{this.showTable = true;}, 1000);
  }

  initEntityData(entity){
    setTimeout(()=>{
      //this.updateTableList();
    },1000);
  }

  initToSave(){
  }

  // save(target, actors){
  //   if(this._editMany){
  //     this.saveMany(target);

  //   }else{
  //     this.initToSave()
  //     this.notifCtrl.saveNewMessage(target, actors);
  //   }
  // }

  //saveMany(target){
    // let base = this.notifCtrl.actualNewData(this.userconver);
    // delete base['_id'];

    // this.userconverEditList.forEach(token =>{
    //   console.log('forEach: [%s] [%s]', token.slug, token._id);
    //   token = this.notifCtrl.updateCommonData(token, base);
    //   //this.userconver = token;
    //   this.saveToken(token)
    // });
    // this.resetEditMany();
  //}

  // saveToken(entity: MessageToken, actor){
  //   this.notifCtrl.updateMessage(entity, actor);
  // }
  // saveNew(entity: MessageToken, actor){
  //   this.initToSave()
  //   this.notifCtrl.cloneItemRecord(entity, actor).then(entity =>{
  //     //this.userconverId = entity._id;
  //     //this.notifCtrl.initUserConversation(entity, entity._id);
  //   });
  // }

  resetEditMany(){
    this.notifCtrl.initUserConversation(this.userconver, this.userconver._id)
    this._editMany = false;
    this.userconverEditList = [];
  }


  openEditor(){
    this.changeEditorTitle();
    this._openEditor = true;
  	return this._openEditor;
  }

  changeType(val){
  }

  messageUpdated(message: MessageToken){
    setTimeout(()=>{
      this.updateTableList();
    },1000);

  }

  editTableSelectedEntityList(){
    this.userconverEditList = this.notifCtrl.fetchSelectedList();
    this.editMany();
  }


  changeEditorTitle(title?){
    if(!title){
      if(this._editMany){
        this._editorTitle = 'Edición múltiple'; 
      }else{
        this._editorTitle = 'Editar mensaje: '; 
      }
    }else{
      this._editorTitle = title;
    }
    this.notifCtrl.changePageTitle(this._editorTitle);
  }

  editMany(){
    this._editMany = false;
    if(!this.userconverEditList || !this.userconverEditList.length) return;
    let usrconv = this.userconverEditList[0];
    this.notifCtrl.initUserConversation(usrconv, usrconv._id);



    // this._editMany = this.userconverEditList.length > 1 ? true : false;

    // this.userconver = this.notifCtrl.buildCommonData(this.userconverEditList);
    // this.userconverId = this.userconver._id;

    // this.notifCtrl.initController(this.userconver, this.userconverId);
    // this.openEditor();
  }

  actionTriggered(action){
    if(action === 'editone')      this.editTableSelectedEntityList();
  }

  volver(target:string ){
    if(target === "public"){
      this.router.navigate(['/' + this.notifCtrl.currentPublicUrl()]);


    }
    if(target === 'admin'){
      this.router.navigate(['/']);
    }

  }

}


//{ 'context.personId': '59701fab9c481d0391eb39b9', userId: '597008d3b13931027e9fa691' }
