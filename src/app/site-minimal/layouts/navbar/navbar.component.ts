import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';

import * as io from 'socket.io-client';

import { User } from '../../../entities/user/user';
import { UserService } from '../../../entities/user/user.service';

import { Actor, Conversation, MessageToPrint, notificationModel } from '../../../notifications/notification.model';

const DEFAULT_AVATAR = 'assets/content/avatar-2.jpg';

@Component({
  moduleId: module.id,
  selector: 'public-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() title: string;

  currentUser: User;
  public loggedIn = false;
  public avatar: string = DEFAULT_AVATAR

  public hideLogin = false;

  private socket: SocketIOClient.Socket; 
  private connected = false;
  private username: string = "";
  private messageList: Array<MessageToPrint> = [];
  private messageLength = 0
  private messageNew = false;


  constructor(
    private userService: UserService,
    private router: Router) {
  }

  ngOnInit() { 
    let that = this;
    this.socket = this.userService.socket;
    this.socket.on('notification:message', function (msj: MessageToPrint) {
      that.addNotificationMessage(msj);
    });

    this.userService.userEmitter.subscribe(user =>{
      this.currentUser = user;
      this.loggedIn = this.isActiveUser(user);
      this.avatar = this.currentUser.avatarUrl || DEFAULT_AVATAR;
      this.emitLogin();
    })
  }


  emitLogin () {
    if(!this.loggedIn) return;
    this.username = this.currentUser.username;

    let usr = {
      username: this.username,
      userId: this.currentUser._id
    }
    this.socket.emit('user:connect', usr);
  }

  addNotificationMessage(data:MessageToPrint){
    this.messageList.unshift(data);
    this.messageLength = this.messageList.length;
    this.messageList = this.messageList.sort((a, b)=>  (b.fe - a.fe))
    this.messageNew = true;
  }


  open(event) {
    let clickedComponent = event.target.closest('.nav-item');
    let items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
    clickedComponent.classList.add('opened');
    this.messageNew = false;
  }

  close2(event) {
    let clickedComponent = event.target;
    let items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
  }

  close1(event) {
    let clickedComponent = event.target;
    let items = clickedComponent.parentElement.children;

    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove('opened');
    }
  }

  isActiveUser(user: User){
    let logged = false;
    if(user && user.username !== 'invitado')
      logged = true;

    return logged;
  }
  
  isAdminUser(){
    return this.userService.isAdminUser();
  }

  editProfile(){
    this.router.navigate(['/develar/entidades/usuarios', this.currentUser._id])
  }

  editUser(e){
    e.stopPropagation();
    e.preventDefault();
    console.log('editUser: [%s]', this.currentUser._id)
    this.router.navigate([ '/develar/entidades/usuarios', this.currentUser._id])
  }

  refreshUser(e){
    e.stopPropagation();
    e.preventDefault();
    this.userService.updateCurrentUser();
  }

  navigateAdmin(e){
    e.stopPropagation();
    e.preventDefault();
    let path = "/develar" ;
    this.router.navigate([path]);
  }

  changeCommunity(e){
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/develar/comunidades'])
  }

  logout(e){
    e.stopPropagation();
    e.preventDefault();
    this.userService.logout();
  }

  loginUser(e){
    e.stopPropagation();
    e.preventDefault();
    if(this.hideLogin) return;
    this.router.navigate(['/ingresar/login'])
  }
}
