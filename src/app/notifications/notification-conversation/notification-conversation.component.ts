import { Component, OnInit, Input } from '@angular/core';

import { Observable }      from 'rxjs';

import { NotificationController } from '../notification.controller';
import { Actor, Conversation, MessageToPrint } from '../notification.model';

@Component({
  selector: 'conversation-detail',
  templateUrl: './notification-conversation.component.html',
  styleUrls: ['./notification-conversation.component.scss']
})
export class NotificationConversationComponent implements OnInit {
	@Input() conversationListener: Observable<string>;

	public  messages: MessageToPrint[] = [];
  private conversationSlug = "detalle de conversación";
  private conversation: Conversation;
  public  openDetail = false;
  private conversationId: string;
  public toggleIcon = false;

  constructor(
    public notifCtrl: NotificationController
  	) { 

  }

  ngOnInit() {

  	this.notifCtrl.conversationListener.subscribe(list => {
  		this.initConversationRender(list);

  	})

    this.conversationListener.subscribe(id => {
      this.conversationId = id;
      this.notifCtrl.initConversationList(this.conversationId);
    })

  }

  initConversationRender(msjList: MessageToPrint[]){
    if(msjList && msjList.length){
      this.conversation = this.notifCtrl.currentConversation;
      this.conversationSlug = this.conversation.content ;
      this.messages = msjList;
      this.openDetail = true;

    }else{
      this.openDetail = false;
    }

  }


}
