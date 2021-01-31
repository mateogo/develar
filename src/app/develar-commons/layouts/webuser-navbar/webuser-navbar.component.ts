import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { User } from '../../../entities/user/user';
import { UserService } from '../../../entities/user/user.service';
import { MessageToPrint } from '../../../notifications/notification.model';
import { SocialMediaItem } from '../../../site-minimal/menu-helper';
import { MinimalMenuService } from '../../../site-minimal/minimal-menu.service';
import { gldef } from '../../develar.config';
import { MainMenuItem } from '../../menu/main-menu/main-menu-item';

const DEFAULT_AVATAR = 'assets/content/' + gldef.logoUser;
const DEFAULT_LOGO = 'assets/img/' + gldef.logoCompany;


const BG_COLOR_DEFAULT = "#ffffff";
const BG_COLOR_LASARGEN_HOME = "#0645f5"; //75787B //0645f5

const NAVBAR_ITEM_COLOR_DEFAULT = "#0072bb";
const NAVBAR_ITEM_COLOR_LASARGEN_HOME = "#ffffff"; //75787B //0645f5
@Component({
  selector: 'webuser-navbar',
  templateUrl: './webuser-navbar.component.html',
  styleUrls: ['./webuser-navbar.component.scss']
})
export class WebuserNavbarComponent implements OnInit {

  @Input() title: string;

  currentUser: User;
  public loggedIn = false;
  public avatar: string = DEFAULT_AVATAR
  public avatar2 = gldef.logoAvatar;
  public logoUrl = DEFAULT_LOGO;

  public navbarStyle = {};
  public navbarItemStyle = {};

  public aboutText = "NavBar Web User";
  public contactText = "buscar";

  public hideLogin = false;
  public isHomeView = true;

  public mainMenuItems: MainMenuItem[];
  public socialItems: SocialMediaItem[];

  private socket: any;
  private connected = false;
  private username: string = "";
  private messageList: Array<MessageToPrint> = [];
  private messageLength = 0
  private messageNew = false;


  private hasActiveUrlPath = false;
  private actualUrl = "";
  private actualUrlSegments: UrlSegment[] = [];
  private navigationUrl = "";




  constructor(
    private userService: UserService,
    private mainMenuService: MinimalMenuService,
    private route: ActivatedRoute,
    private router: Router) {

    mainMenuService.menuListener$.subscribe(
      items => {
        this.mainMenuItems = items;
      }
    );

    mainMenuService.socialListener$.subscribe(
      items => {
        this.socialItems = items;
      }
    );
  }

  ngOnInit() {
    this.initSocket();
    this.mainMenuService.loadDefaultMenuItems(gldef.mainmenu);
    this.mainMenuService.loadSocialItems(gldef.socialmedia);

    this.initUser()

    this.route.url.subscribe(url => {
      this.actualUrl = this.router.routerState.snapshot.url;
      this.actualUrl = this.actualUrl ? this.actualUrl.split('?')[0] : this.actualUrl;

      if (!this.actualUrl || this.actualUrl === "/") {
        this.setupHomeView(true);

      } else {
        this.setupHomeView(false);

      }
    });


    // this.userService.userEmitter.subscribe(user =>{
    //   this.initUser();
    // })


  }


  initSocket() {
    let that = this;
    this.socket = this.userService.socket;
    this.socket.on('notification:message', function (msj: MessageToPrint) {
      that.addNotificationMessage(msj);
    });

  }

  initUser() {
    this.userService.userEmitter.subscribe((user: User) => {
      this.currentUser = user;
      this.loggedIn = this.userService.userlogged;
      this.avatar = this.currentUser.avatarUrl || DEFAULT_AVATAR;
      this.emitLogin();
    });

  }


  emitLogin() {
    if (!this.loggedIn) return;
    this.username = this.currentUser.username;

    let usr = {
      username: this.username,
      userId: this.currentUser._id
    }
    this.socket.emit('user:connect', usr);
  }

  addNotificationMessage(data: MessageToPrint) {
    this.messageList.unshift(data);
    this.messageLength = this.messageList.length;
    this.messageList = this.messageList.sort((a, b) => (b.fe - a.fe))
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

  isActiveUser(user: User) {
    let logged = false;
    if (user && user.username !== 'invitado')
      logged = true;

    return logged;
  }

  isAdminUser() {
    return this.userService.isAdminUser();
  }

  editProfile() {
    this.router.navigate(['/develar/entidades/usuarios', this.currentUser._id])
  }

  editUser(e) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/develar/entidades/usuarios', this.currentUser._id])
  }

  refreshUser(e) {
    e.stopPropagation();
    e.preventDefault();
    this.userService.updateCurrentUser();
  }

  navigateAdmin(e) {
    e.stopPropagation();
    e.preventDefault();
    let path = gldef.admintarget || "/develar/fichas/lista";
    this.router.navigate([path]);
  }

  changeCommunity(e) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/develar/comunidades'])
  }

  logout(e) {
    e.stopPropagation();
    e.preventDefault();
    this.userService.logout();
    this.router.navigate(['']);


  }

  changePasswd(e) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/ingresar/clave', this.currentUser._id])

  }

  searchAssetsForm(e) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/web/fichatecnica'])
  }

  searchPage(e) {
    e.stopPropagation();
    e.preventDefault();
    this.router.navigate(['/trabajan/red'])

  }

  loginUser(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.hideLogin) return;
    this.router.navigate(['/ingresar/login'])
  }

  toggle(event: Event, item: any, el: any) {
    event.preventDefault();

    let items: any[] = el.mainMenuItems;

    if (item.active) {
      item.active = false;
    } else {
      for (let i = 0; i < items.length; i++) {
        items[i].active = false;
      }
      item.active = true;
    }
  }

  setupHomeView(isHome) {

    if (isHome) {
      this.isHomeView = true;
      this.navbarStyle = {
        background: BG_COLOR_DEFAULT
      }
      this.navbarItemStyle = {
        color: NAVBAR_ITEM_COLOR_DEFAULT
      }

    } else {
      this.isHomeView = false;
      this.navbarStyle = {
        background: BG_COLOR_DEFAULT
      }
      this.navbarItemStyle = {
        color: NAVBAR_ITEM_COLOR_DEFAULT
      }
    }

  }

  goToMisConsultasYSolicitudes() {
    this.router.navigate(['dashboard']);
  }

  // goToHistorial(){
  //   this.router.navigate(['web','historial']);
  // }

}
