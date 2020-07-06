import { Component, OnInit } from '@angular/core';

import * as io from 'socket.io-client';

import { NotificationController } from '../notification.controller';
import { Actor, Conversation, MessageToPrint, notificationModel } from '../notification.model';


const ENTER = 13;

@Component({
  selector: 'app-notifications-socket',
  templateUrl: './notifications-socket.component.html',
  styleUrls: ['./notifications-socket.component.scss']
})
export class NotificationsSocketComponent implements OnInit {
	private TYPING_TIMER_LENGTH = 400;
	private username: string = "";
	private typing = false;
	private lastTypingTime: number;
	private socket: any; 


  public content: string = "";
  public status = "bienvenido";
  public connected = false;
	public messageList: Array<string> = [];


  constructor(
    	public notifCtrl: NotificationController
  	) { 

  		this.socket = notifCtrl.socket;
  }

  ngOnInit() {
  	let that = this;
	  // Whenever the server emits 'login', log the login message
	  this.socket.on('login', function (data: Participants) {
    	console.log('EVENT cb login user');
	    that.connected = true;

	    // Display the welcome message
	    that.addChatMessage(new MessageToPrint({content: "Bienvenido a develar/Chat – "}))
	    that.addParticipantsMessage(data);
	  });

	  // Whenever the server emits 'notification:new', update the chat body
	  this.socket.on('notification:new', function (data) {
    	console.log('notification:new token');
	    that.addChatMessage(new MessageToPrint(data));
	  });

	  // Whenever the server emits 'user joined', log it in the chat body
	  this.socket.on('user:joined', function (data) {
    	console.log('user:joined');
			that.addParticipantsMessage(data);
	  });

	  // Whenever the server emits 'user left', log it in the chat body
	  this.socket.on('user:left', function (data) {
	    console.log('user:left');
	    that.addParticipantsMessage(data);
	  });

	  // Whenever the server emits 'typing', show the typing message
	  this.socket.on('typing:start', function (data) {
	    console.log('cb typing');
	    that.addChatTyping(data);
	  });

	  // Whenever the server emits 'stop typing', kill the typing message
	  this.socket.on('typing:stop', function (data) {
	  	that.stopChatTyping(data);
	    console.log('cb stop typing');
	  });

	  this.socket.on('disconnect', function () {
	    console.log('Server emits: disconnect');
	  });

	  this.socket.on('reconnect', function () {
	    console.log('cb you have been reconnected');
	    if (that.username) {
	    	that.emitLogin()
	    }
	  });

	  this.socket.on('reconnect_error', function () {
	    console.log('cb attempt to reconnect has failed');
	  });

	  this.socket.on('notification:message', function (msj: MessageToPrint) {
	  	console.log('notification:message RECEIVED !!!!!!!!!!!!!!!!!!!!!!!')
	  	that.addNotificationMessage(msj);
	  });

  }

  // UI events
  newMessage(){
  	console.log('new Message');
  	this.sendMessage();

  }

  login(){
  	console.log('login [%s]', this.username);
  	this.emitLogin()
  }

	messaging(e, value){
		//console.log('Typing [%s]', e.keyCode)
		if(e.keyCode === ENTER){
			this.socket.emit('typing:stop');
   		this.typing = false;

		}else{
			this.typing = true;
			this.socket.emit('typing:start');
		}
	}

	logout(){
		console.log('click: logut ')
		this.socket.emit('goodbye', 'me harté'); 
	}

	// implementation
  // Sets the client's username
  emitLogin () {
  	this.username = this.notifCtrl.currentuser.username;

  	let usr = {
  		username: this.username,
  		userId: this.notifCtrl.currentuser._id
  	}
  	this.socket.emit('user:connect', usr);
  }

  // Sends a chat message
  sendMessage () {
  	console.log('sendMessage: [%s]  [%s]', this.content, this.connected)
    if (this.content && this.connected) {
    	let msj = new MessageToPrint({
			  username: this.username,
			  content: this.content
			});

			this.addChatMessage(msj);
      // tell server to execute 'notification:new' and send along one parameter
      this.socket.emit('notification:new', msj);
    }
  }


  addParticipantsMessage (data: Participants) {
  	console.log('addParticipants: [%s]', data);
  	console.dir(data);

    let message = '';
    if (data.numUsers === 1) {
      message += "there's 1 participant";
    } else {
      message += "there are " + data.numUsers + " participants";
    }
    this.status = message;
  }




  addNotificationMessage(data:MessageToPrint){
  	this.messageList.unshift(this.notificationLine(data));
  }
  // Adds the visual chat message to the message list
  addChatMessage (data: MessageToPrint, options?) {
  	this.messageList.unshift(this.messageLine(data));
  }

  notificationLine(msj){
  	let txt = "";
  	let tokens = [];
  	if(msj.fe && msj.feTxt) tokens.push(msj.feTxt);


  	if(msj.from){
  		tokens.push('De: ' + msj.from);
  	}
  	if(msj.to){
  		tokens.push('Para: ' + msj.to);
  	}
  	if(msj.content) tokens.push(' ' + msj.content + ' ');

  	txt = tokens.join(' ')
  	// {{msj.role || ''}}: {{ msj.username}} escribió: {{msj.content}} {{msj.feTxt}} {{msj.role}}//
  	return txt;
  }


  messageLine(msj){
  	let txt = "";
  	let tokens = [];
  	if(msj.fe && msj.feTxt) tokens.push(msj.feTxt);

  	if(msj.role){
  		if(msj.role === 'to') tokens.push('Para: ')
  		else tokens.push('De: ');
  	}
  	if(msj.username) tokens.push(' ' + msj.username + ': ');
  	if(msj.content) tokens.push('dice: <strong>' + msj.content + ' </strong>');
  	txt = tokens.join(' ')
  	// {{msj.role || ''}}: {{ msj.username}} escribió: {{msj.content}} {{msj.feTxt}} {{msj.role}}//
  	return txt;
  }


  // Adds the visual chat typing message
  addChatTyping (data: Participants) {
    this.status = data.username +' está escribiendo...'
  }

	stopChatTyping(data){
		this.status = 'bienvenido...'
	}


  // Updates the typing event
  updateTyping () {
    // if (this.connected) {
    //   if (!this.typing) {
    //   	console.log('local typing emit')
    //     this.typing = true;
    //     this.socket.emit('typing');
    //   }


      // this.lastTypingTime = (new Date()).getTime();
      // setTimeout(function () {
      //   var typingTimer = (new Date()).getTime();
      //   var timeDiff = typingTimer - this.lastTypingTime;
      //   if (timeDiff >= this.TYPING_TIMER_LENGTH && this.typing) {
      //     this.socket.emit('stop typing');
      //     this.typing = false;
      //   }
      // }, this.TYPING_TIMER_LENGTH);

    //}

  }

  // // Gets the 'X is typing' messages of a user
  // getTypingMessages (data) {
  //   return $('.typing.message').filter(function (i) {
  //     return $(this).data('username') === data.username;
  //   });
  // }
  // Keyboard events

  // Socket events
}

// class Message {
// 	username: string ="";
// 	message: string = "";
// 	typing = false;
// 	content: string = "";
// 	fe: number = 0;
// 	actor

// 	constructor(data?){
// 		if(data) {
// 			this.username = data.username || "";
// 			this.content = data.message || "";
// 			if(data.typing){
// 				this.typing = true;
// 			}
// 		}
// 	}

// }

class Participants {
	numUsers: number = 0;
	username: string = "";
	typing: boolean = false;

}
