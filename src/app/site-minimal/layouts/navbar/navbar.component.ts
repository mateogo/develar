import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//import * as io from 'socket.io-client';

import { User } from '../../../entities/user/user';
import { UserService } from '../../../entities/user/user.service';
import { gldef } from '../../../develar-commons/develar.config';

import { Actor, Conversation, MessageToPrint, notificationModel } from '../../../notifications/notification.model';

const DEFAULT_AVATAR = 'assets/content/' + gldef.logoUser;
const DASHBOARD = gldef.dashboard;

@Component({
  selector: 'public-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() title: string;

  currentUser: User;
  public loggedIn = false;
  public avatar: string = DEFAULT_AVATAR
  public avatar2 = gldef.logoAvatar;

  public hideLogin = false;

  private socket: any; 
  private connected = false;
  private username: string = "";
  private messageList: Array<MessageToPrint> = [];
  private messageLength = 0
  private messageNew = false;
  private actualUrl:string ;


  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) {
  }

  ngOnInit() { 
    this.initSocket();

    this.initUser()

    this.userService.userEmitter.subscribe(user =>{
      this.initUser();
    })

    this.route.url.subscribe(url=> {
      this.actualUrl = this.router.routerState.snapshot.url;
      this.actualUrl = this.actualUrl ? this.actualUrl.split('?')[0] : this.actualUrl;

      if(!this.actualUrl || this.actualUrl === "/"){
        this.setupHomeView(true);

      } else {
        this.setupHomeView(false);

      }
    });
  }

  initSocket(){
    let that = this;
    this.socket = this.userService.socket;
    this.socket.on('notification:message', function (msj: MessageToPrint) {
      that.addNotificationMessage(msj);
    });

  }

  initUser(){
      this.currentUser = this.userService.currentUser;
      this.loggedIn = this.userService.userlogged;
      this.avatar = this.currentUser.avatarUrl || DEFAULT_AVATAR;
      this.emitLogin();    
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
    let path = gldef.admintarget ||  "/develar/fichas/lista" ;
    this.router.navigate([path]);
  }

  changeCommunity(e){
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/develar/comunidades']);
  }

  logout(e){
    e.stopPropagation();
    e.preventDefault();
    this.userService.logout();
    this.router.navigate(['/']);
  }

  gotoDashboard(e){
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate([gldef.dashboard]);
  }

  changePasswd(e){
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/ingresar/clave', this.currentUser._id]);
  }

  setupHomeView(isHome){

  }

  loginUser(e){
    e.stopPropagation();
    e.preventDefault();
    if(this.hideLogin) return;
    this.router.navigate(['/ingresar/login']);
  }
}
