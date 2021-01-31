import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DaoService } from '../../develar-commons/dao.service';
import { Person } from '../person/person';
import { UserWeb } from './user-web.model';

const RECORD : string = "userweb"
@Injectable({
    providedIn : 'root'
})
export class UserWebService {

    private isLogIn = false;
    private hasLogout = false;
    private usersUrl = "api/usuariosweb"; // URL to web api
    private userUrlExtra = "api/usuariosweb/"; //URL CON /
  
    private userApiFetchPerson = 'api/usuariosweb/%s/persona';
  
    private headers = new HttpHeaders().set("Content-Type", "application/json");
    private _currentUser: UserWeb;
    private _userEmitter: BehaviorSubject<UserWeb>;
    endSetUser$ : Subject<boolean>;
  
  
    private currentUserSubj: Subject<UserWeb> = new Subject<UserWeb>();
    public currentUserObservable$: Observable<UserWeb> = this.currentUserSubj.asObservable()
  
  
    constructor(
      private _router: Router,
      private http: HttpClient,
      private daoService: DaoService
    ) {
      this._userEmitter = new BehaviorSubject<UserWeb>(null);
      this.endSetUser$ = new Subject();
    }
  
  
    private notFetchedMore : boolean = false;
  
    login(user: any): Promise<UserWeb> {
      const url = `${this.usersUrl}/${"login"}`;
      this.hasLogout = false;
      return this.http
        .post(url, JSON.stringify(user), { headers: this.headers })
        .toPromise()
        .catch(this.loginError);
    }/********** */
  
    logout(): Promise<any> {
      let url = `${this.usersUrl}/${"logout"}`;
      this.isLogIn = false;
      this.hasLogout = true;
      this._currentUser = null;
      this._userEmitter.next(this._currentUser);
      return this.http.get(url)
        .toPromise()
        .catch(this.handleError);
    } /***** */
  
    private handleError(error: any): Promise<any> {
  
      return Promise.reject(error.message || error);
    }/** */
  
    private loginError(error: any): Promise<any> {
      this.isLogIn = false;
      this.hasLogout = false;
      return Promise.reject(
        {
          message:
            "loginError: fallo en la autenticación, el usuario o la clave son incorrectas",
        },
      );
    } /** */
  
    get userlogged(): boolean {
      return this.isLogIn;
    } /** */
  
    initLoginUser() {
      let fetchedUser: UserWeb;
      let loggedIn = false;
      let loginUser = new Subject<UserWeb>();
 
      this.loadLoginUser().then((res) => {
        fetchedUser = res as UserWeb;
        loggedIn = (fetchedUser && fetchedUser._id) ? true : false;
  
        if (!loggedIn) {
          setTimeout(() => {
            this.loadLoginUser().then((res) => {
              fetchedUser = res as UserWeb;
              loggedIn = (fetchedUser && fetchedUser._id) ? true : false;
  
              if (!loggedIn) {
                // Lo redirigimos a la pantalla principal
                this._router.navigateByUrl("");
              } else {
                this.setLoginUser(fetchedUser, loginUser);
              }
            });
          }, 2000);
        } else {
          this.setLoginUser(fetchedUser, loginUser);
        }
      })
        .catch(this.handleError);
  
      return loginUser;
    }
  
    loadLoginUser() {
      const url = `${this.usersUrl}/${"currentuser"}`;
      return this.http
        .get(url)
        .toPromise();
    }
  
    setLoginUser(user: UserWeb, loginUser: Subject<UserWeb>) {
      this._currentUser = user;
      this.isLogIn = true;
      this.hasLogout = false;
      loginUser.next(this._currentUser);
      this._userEmitter.next(this._currentUser);
      this.endSetUser$.next(true);
      this.currentUserSubj.next(user);
    }
  
  
    updateCurrentUser(): Promise<UserWeb> {
          const url = `${this.usersUrl}/${'currentuser'}`;
          return this.http
              .get(url)
              .toPromise()
              .then(res =>{
                  let fetchedUser = res as UserWeb;
                  this.isLogIn = (fetchedUser && fetchedUser._id) ? true: false;
  
                  if(!this.isLogIn ){
                      this.hasLogout = true;
  
                  }else {
                      this.hasLogout = false;
                      this._currentUser = fetchedUser;
                       
                  }
  
                this.userEmitter.next(this._currentUser);
                this.notFetchedMore = true;
                return this._currentUser;
              })
              .catch(this.handleError);
    }
  
    get userEmitter(): Subject<UserWeb> {
      return this._userEmitter;
    }
  
    get currentUser(): UserWeb {
  
      if(!this.hasLogout && !this.notFetchedMore){
          this.updateCurrentUser();
      }
      //c onsole.log(this._currentUser)
      return this._currentUser;
  
    }

    fetchCurrentUser(): Observable<UserWeb>{
      let listener = new Subject<UserWeb>();
      if(this._currentUser && this._currentUser._id){
        listener.next(this._currentUser);
      }else {

        const url = `${this.usersUrl}/${'currentuser'}`;
        this.http
            .get(url)
            .toPromise()
            .then(res =>{
                let fetchedUser = res as UserWeb;
                this.isLogIn = (fetchedUser && fetchedUser._id) ? true: false;

                if(!this.isLogIn ){
                    this.hasLogout = true;
                    listener.next(null);

                }else {
                    this.hasLogout = false;
                    this._currentUser = fetchedUser;
                    this.userEmitter.next(this._currentUser);
                    listener.next(this._currentUser);
                }
            })
            .catch(this.handleError)
      }

      return listener;
    }
  
    set currentUser(user: UserWeb){

      this._currentUser = user;
    }
  
    createUserWeb(user: UserWeb): Promise<UserWeb> {
      return this.daoService.create(RECORD, user);
    }
  
    resetPassword(datos : any) : Promise<any> {
      const url = this.usersUrl+'/resetpassword';
      return this.http.post(url, JSON.stringify(datos), {headers : this.headers}).toPromise().catch();
    }
  
    updateDataUser(id : string, data : UserWeb) : Promise<UserWeb> {
      return this.http.put<UserWeb>(this.userUrlExtra+id,data, {headers : this.headers}).toPromise().catch();
    }
  
    public fetchPersonByUserId(id: string): Promise<Person> {
      return this.http
        .get<Person>(this.userApiFetchPerson.replace('%s', id), { headers: this.headers })
        .toPromise();
    }
  
    public fetchById(id: string): Promise<UserWeb> {
      return this.http.get<UserWeb>(this.userUrlExtra + id, { headers: this.headers }).toPromise();
    }
  
    //TEST
  
    public testUserByDNI(tdoc:string, ndoc:string ): Observable<UserWeb[]>{
  
      let query = {
        tdoc: tdoc,
        ndoc: parseInt(ndoc)
      }
      return this.daoService.search<UserWeb>(RECORD, query);
  
  
    }
  
  
  
  
  
    public testUserByEmail(email ): Observable<UserWeb[]>{
      let query = {
        email: email,
      }
      return this.daoService.search<UserWeb>(RECORD, query)
  
    }
}