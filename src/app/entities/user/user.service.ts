import { Injectable }    from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams }    from '@angular/common/http';

import { BehaviorSubject ,  Subject }       from 'rxjs';



import * as io from 'socket.io-client';

import { User, CurrentCommunity } from './user';
import { Person } from '../person/person';
import { Community } from '../../develar-commons/community/community.model';


const estados = [
	{val: 'no_definido', 	label:'Seleccione opción'},
	{val: 'pendiente', 		label:'Pendiente'},
	{val: 'activo', 			label:'Activo'},
	{val: 'suspendido',		label:'Suspendido'},
	{val: 'baja', 				label:'Baja'},

];

const avances = [
	{val: 'no_definido', 	label: 'Seleccione opción'},
	{val: 'webform', 		  label: 'Alta por Webform'},
	{val: 'lnocturno', 	  label: 'Alta por Webform Locales Nocturnos'},
	{val: 'mailok', 			label: 'Correo verificado'},
	{val: 'approved',		  label: 'Aprobado'},
	{val: 'desafectado', 	label: 'Desafectado'},
];

const modulos = [
	{val: 'no_definido', 	label: 'Seleccione opción'},
	{val: 'core', 		    label: 'General'},
	{val: 'com',      	  label: 'COM'},
	{val: 'medico',   	  label: 'Médico'},
	{val: 'same',     	  label: '107Same'},
	{val: 'webmaster', 	  label: 'Webmaster'},
	{val: 'marketing', 	  label: 'Marketing'},
	{val: 'encuestador', 	label: 'Encuestador'},
	{val: 'productor', 	  label: 'Productor'},
	{val: 'qa', 		    	label: 'Calidad'},
];

const roles = [
	{val: 'no_definido', 	label: 'Seleccione opción'},
	{val: 'operator',     label: 'Operador'},
	{val: 'admin', 	      label: 'Admin'},
	{val: 'master', 	  	label: 'Master'},
];

var nextUser = 40;

@Injectable()
export class UserService {
	private _socket: SocketIOClient.Socket;
	private usersUrl = 'api/users';  // URL to web api
	private personUrl = 'api/persons';  // URL to web api
	private headers = new HttpHeaders().set('Content-Type', 'application/json');

	private _currentUser: User;
	private _userEmitter: BehaviorSubject<User>;

	private isLogIn = false;
	private hasLogout = false;

	constructor(private http: HttpClient) { 
		this.currentUser = new User('invitado', 'invitado@develar')
		this._userEmitter = new BehaviorSubject<User>(this.currentUser);
		this._socket = io();
	}
	

	/**************
		DAO FUNCTIONS
	******************/
	getUsers(): Promise<User[]> {
		return this.http.get(this.usersUrl)
		           .toPromise()
		           .catch(this.handleError);
	}

	private handleError(error: any): Promise<any> {
		console.error('handleError: Ocurrió un error [%s] [%s]',error, arguments.length);

		return Promise.reject(error.message || error);
	}

	create(user: User): Promise<User> {
		const url = `${this.usersUrl}/${'signup'}`;
		return this.http
			.post(url, JSON.stringify(user), {headers: this.headers})
			.toPromise()
			.catch(this.handleError);
	}

	update(user: User): Promise<User> {
		const url = `${this.usersUrl}/${'signup'}/${user._id}`;
		return this.http
			.put(url, JSON.stringify(user), {headers: this.headers})
			.toPromise()
			.catch(this.handleError);
	}

	credentials(user: User): Promise<User> {
		const url = `${this.usersUrl}/${'credentials'}/${user._id}`;
		return this.http
			.put(url, JSON.stringify(user), {headers: this.headers})
			.toPromise()
			.catch(this.handleError);
	}


	getPerson(): Promise<Person> {
		let id = this._currentUser.personId;
		const url = `${this.personUrl}/${id}`;
		return this.http.get(url)
				.toPromise()
				.catch(this.handleError);
	}


	getUser(id: string): Promise<User> {
		const url = `${this.usersUrl}/${id}`;
		return this.http.get(url)
				.toPromise()
				.catch(this.handleError);
	}

	delete(id: string): Promise<void> {
		const url = `${this.usersUrl}/${id}`;
		return this.http.delete(url, {headers: this.headers})
			.toPromise()
			.then(() => null)
			.catch(this.handleError);
	}
	

	/**************
		COMMUNITY MANAGEMENT
	******************/
	changeCurrentCommunity(community: Community){
		let move_to: CurrentCommunity = {
			id: community.id,
			name: community.name,
			slug: community.slug,
			displayAs: community.displayAs
		}
		let user:User = this._currentUser;
		user.communityId = community._id;
		user.communityUrlpath = community.urlpath;
		user.currentCommunity = move_to;
		this.update(user)
		this.userEmitter.next(user);

	}

	changeUserCommunity(user: User, community: Community){
		let move_to: CurrentCommunity = {
			id: community.id,
			name: community.name,
			slug: community.slug,
			displayAs: community.displayAs
		}
		user.communityId = community._id;
		user.communityUrlpath = community.urlpath;
		user.currentCommunity = move_to;
		this.update(user)
	}


	/**************
		LOGIN MANAGEMENT
	******************/
	login(user: User): Promise<User> {
		const url = `${this.usersUrl}/${'login'}`;
		this.hasLogout = false;
		return this.http
			.post(url, JSON.stringify(user), {headers: this.headers})
			.toPromise()
			.catch(this.loginError);
	}

	googlelogin(): Promise<User> {
		const url = `${this.usersUrl}/${'login/google'}`;
		this.hasLogout = false;
		return this.http
			.get(url)
			.toPromise()
			.catch(this.loginError);
	}

	logout(){

		let url = `${this.usersUrl}/closesession`;
		this.isLogIn = false;
		this.hasLogout = true;
		this._currentUser = new User('invitado', 'invitado@develar');
		this._userEmitter.next(this._currentUser);
		this.http.get(url)
				.toPromise()
				.catch(this.handleError);

	}

	private loginError(error: any): Promise<any> {
		this.isLogIn = false;
		this.hasLogout = false;
		return Promise.reject({message: 'loginError: fallo en la autenticación, el usuario o la clave son incorrectas'});
	}

	/**************
		MAIL NOTIFICATION
	**********************/
	sendMailFactory(opt?: Object): SendMail{
		return new SendMail(opt);
	}

	send(mail: SendMail): Promise<any> {
		return this.http
			.post(mail.url, JSON.stringify(mail.content), {headers: this.headers})
			.toPromise()
			.catch(this.handleError);
	}


	initCurrentUser(){
		// OjO esto es solo para desarrollo
		this.currentUser.password = "abc1234";
		this.login(this.currentUser)
			.then(user => {
				this.currentUser = user;
				if(!this.currentUser.currentCommunity){
					this.currentUser.currentCommunity = {
						id: null,
						name:'develar',
						slug:'develar',
						displayAs:'develar'
					}
				}
				this._userEmitter.next(this.currentUser);
			})
	}

	/**************
		API UTILS
	******************/

	get userEmitter():BehaviorSubject<User>{
		return this._userEmitter;
	}

	get socket(): SocketIOClient.Socket{
		return this._socket;
	}

	get userlogged(): boolean{
		return this.isLogIn;
	}


	/***** CURRENT USER     **********/
	get currentUser():User{
		if(this._currentUser.username === 'invitado' && !this.hasLogout){
			this.updateCurrentUser();
		}
		
		return this._currentUser;
	}

	set currentUser(user: User){
		this._currentUser = user;
	}

	//****************** login management  *****************
	initLoginUser() {
		let fetchedUser: User;
		let loggedIn = false;
		let loginUser = new Subject<User>();

		this.loadLoginUser().then(res =>{
				fetchedUser = res as User;
				loggedIn = (fetchedUser && fetchedUser._id) ? true : false;

				if(!loggedIn ){
					setTimeout(() =>{

						this.loadLoginUser().then(res =>{
										fetchedUser = res as User;
										loggedIn = (fetchedUser && fetchedUser._id) ? true: false;

										if(!loggedIn ){
											fetchedUser = new User('invitado', 'invitado@develar');
											this.setAnonimousUser(fetchedUser, loginUser);

										}else{
											this.setLoginUser(fetchedUser, loginUser);
										}
						})
					},2000)

				}else {
					this.setLoginUser(fetchedUser, loginUser);
				}

			})
			.catch(this.handleError);	

		return loginUser;
	}


	loadLoginUser(){
		const url = `${this.usersUrl}/${'currentuser'}`;
		return this.http
			.get(url)
			.toPromise()	
	}

	setAnonimousUser(user: User, loginUser: Subject<User>){
		this._currentUser = user;
		this.isLogIn = false;
		this.hasLogout = false;
		loginUser.next(this._currentUser);
		this.userEmitter.next(this._currentUser);
	}

	setLoginUser(user: User, loginUser: Subject<User>){
		this._currentUser = user;
		this.isLogIn = true;
		this.hasLogout = false;
		loginUser.next(this._currentUser);
		this.userEmitter.next(this._currentUser);
	}

	//****************** END: login management  *****************

	updateCurrentUser(): Promise<User> {
		const url = `${this.usersUrl}/${'currentuser'}`;
		return this.http
			.get(url)
			.toPromise()
			.then(res =>{
				let fetchedUser = res as User;
				this.isLogIn = (fetchedUser && fetchedUser._id) ? true: false;

				if(!this.isLogIn ){
					this.hasLogout = true;
					this.currentUser = new User('invitado', 'invitado@develar');

				}else {
					this.hasLogout = false;
					this.currentUser = fetchedUser;
				}

				this.userEmitter.next(this._currentUser);
				return this._currentUser;
			})
			.catch(this.handleError);
	}

	getEstados(){
		return estados;
	}

	getAvances(){
		return avances;
	}

	getRoles(){
		return roles;
	}

	isAdminUser(){
		let user = this.currentUser;
		let roles = user.moduleroles;
		let admin = false;
		if(roles && roles.length){
			if(roles.indexOf('core:admin') !== -1){
				admin = true;
			}
		}
		return admin;
	}

	getModulos(){
		return modulos;
	}

}






class SendMail{
	private urlRoot = '/api/utils/sendmail';
	private httpHeaders = new Headers({'Content-Type': 'application/json'});

	private mailData = {
		from:  '',
		to:    '',
		cc:    '',
		subject:  '',
		body:  '',
	}

	private handleError(error: any): Promise<any> {
		console.error('Ocurrió un error [user.service]', error);

		return Promise.reject(error.message || error);
	}

	constructor (options?: Object){
		if(options) Object.assign(this.mailData, options);
	}


	set mailFrom(data){
		this.mailData.from = data;
	}

	set mailTo(data){
		this.mailData.to = data;
	}

	set mailSubject(data){
		this.mailData.subject = data;
	}

	set mailBody(data){
		this.mailData.body = data;
	}

	get content(){
		return this.mailData;
	}
	
	get url(){
		return this.urlRoot;
	}

	get headers(){
		return this.httpHeaders;
	}


}
