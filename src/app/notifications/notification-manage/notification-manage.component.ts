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
  public context: ConversationContext;


  constructor(
      private notificationCtrl: NotificationController,
      private router: Router
    ) { }

  ngOnDestroy(){
    console.log('noOnDestroy')
    this._modelSbscrptn.unsubscribe()

  }

  ngOnChanges(){
    console.log('ngOnChanges;')
  }

  ngOnInit() {
    console.log('NOTIFICATION-MANAGE INIT ***************+')

    this._modelSbscrptn = this.notificationCtrl.userconversationListener.subscribe(entity =>{
      this.initEntityData(entity);
      this.userconver = entity;
    })


    this.notificationCtrl.initUserConversation(this.userconver, this.userconverId);

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
    console.log('updateSelRecords:[%s]', list.length)
  }

  updateTableList(){
    console.log('fetch Userconversations!!!!')
    this.notificationCtrl.fetchUserConversations(this.context);
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
  //     this.notificationCtrl.saveNewMessage(target, actors);
  //   }
  // }

  //saveMany(target){
    // let base = this.notificationCtrl.actualNewData(this.userconver);
    // delete base['_id'];

    // this.userconverEditList.forEach(token =>{
    //   console.log('forEach: [%s] [%s]', token.slug, token._id);
    //   token = this.notificationCtrl.updateCommonData(token, base);
    //   //this.userconver = token;
    //   this.saveToken(token)
    // });
    // this.resetEditMany();
  //}

  // saveToken(entity: MessageToken, actor){
  //   this.notificationCtrl.updateMessage(entity, actor);
  // }
  // saveNew(entity: MessageToken, actor){
  //   this.initToSave()
  //   this.notificationCtrl.cloneItemRecord(entity, actor).then(entity =>{
  //     //this.userconverId = entity._id;
  //     //this.notificationCtrl.initUserConversation(entity, entity._id);
  //   });
  // }

  resetEditMany(){
    this.notificationCtrl.initUserConversation(this.userconver, this.userconver._id)
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
    console.log('messageUpdate EMITTED +*******');

    setTimeout(()=>{
      this.updateTableList();
    },1000);

  }

  editTableSelectedEntityList(){
    console.log('editSelected**************')
    this.userconverEditList = this.notificationCtrl.fetchSelectedList();
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
    this.notificationCtrl.changePageTitle(this._editorTitle);
  }

  editMany(){
    console.log('editMany [%s]', this.userconverEditList.length)
    this._editMany = false;
    if(!this.userconverEditList || !this.userconverEditList.length) return;
    let usrconv = this.userconverEditList[0];
    this.notificationCtrl.initUserConversation(usrconv, usrconv._id);



    // this._editMany = this.userconverEditList.length > 1 ? true : false;

    // this.userconver = this.notificationCtrl.buildCommonData(this.userconverEditList);
    // this.userconverId = this.userconver._id;

    // this.notificationCtrl.initController(this.userconver, this.userconverId);
    // this.openEditor();
  }

  actionTriggered(action){
    console.log(`${whoami}  actionTriggered: ${action}`);
    if(action === 'editone')      this.editTableSelectedEntityList();
  }

  volver(target:string ){
    if(target === "public"){
      this.router.navigate(['/' + this.notificationCtrl.currentPublicUrl()]);


    }
    if(target === 'admin'){
      this.router.navigate(['/']);
    }

  }

}


//{ 'context.personId': '59701fab9c481d0391eb39b9', userId: '597008d3b13931027e9fa691' }
