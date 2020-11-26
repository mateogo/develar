import { Injectable } from '@angular/core';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DaoService } from '../../../develar-commons/dao.service';
import { Address, Person, UpdatePersonEvent } from '../../../entities/person/person';
import { UserWeb } from '../../../entities/user-web/user-web.model';
import { UserWebService } from '../../../entities/user-web/user-web.service';

const ATTENTION_ROUTE = "atencionsocial";
const ALIMENTOS_ROUTE = "alimentos";
const SEGUIMIENTO_ROUTE = "seguimiento";
const CORE = 'core';
const CONTACT = 'contact';
const PERMISOS = 'permisos';
const HABILITACIONES = 'habilitaciones';
const ADDRESS = 'address';
const FAMILY = 'family';
const OFICIOS = 'oficios';
const SALUD = 'salud';
const COBERTURA = 'cobertura';
const ENCUESTA = 'ambiental';
const VINCULOS = 'vinculos';

@Injectable({
    providedIn: 'root'
})
export class PersonasController {

    private hasActiveUrlPath = false;
    private _route: ActivatedRoute;
    private actualUrl = "";
    private actualUrlSegments: UrlSegment[] = [];
    private navigationUrl = "";
    public onReady = new BehaviorSubject<boolean>(false);

    private currentPerson: Person;

    public timestamp;

    public personListener = new Subject<Person>();

    constructor(private daoService: DaoService,
        private userService: UserWebService) { }


    actualRoute(snap: string, mRoute: UrlSegment[]) {
        this.hasActiveUrlPath = false;

        this.actualUrl = snap ? snap.split('?')[0] : snap;
        this.actualUrlSegments = mRoute;
        this.navigationUrl = this.fetchNavigationUrl(this.actualUrl, this.actualUrlSegments.toString())
        if (this.navigationUrl) this.hasActiveUrlPath = true;
        this.onReady.next(true)


    }
    addressLookUp(address: Address): Promise<any>{
        return this.daoService.geocodeForward(address);
      }

    ////************* Navigation url-token  ************////
    private fetchNavigationUrl(snap, urlmodule) {
        let urlpath: string = "";

        if (urlmodule) {
            urlpath = snap.substr(1, (snap.length - urlmodule.length - 2));
        } else {
            urlpath = snap.substr(1);
        }

        if (urlpath) {
            let split = urlpath.split('/')
            urlpath = split[0];
        }
        return urlpath
    }

    /***************************/
    /****** Person EVENTS ******/
    /***************************/

    updatePerson(event: UpdatePersonEvent) {

        if (event.token === CORE) {
            this.upsertPersonCore(event.person._id, event.person);
        }

        if (event.token === CONTACT) {
            this.upsertPersonCore(event.person._id, event.person);
        }

        if (event.token === PERMISOS) {
            this.upsertPersonCore(event.person._id, event.person);
        }

        if (event.token === HABILITACIONES) {
            this.upsertPersonCore(event.person._id, event.person);
        }

        if (event.token === ADDRESS) {
            this.upsertPersonCore(event.person._id, event.person);
        }

        if (event.token === FAMILY) {
            this.upsertPersonCore(event.person._id, event.person);
        }

        if (event.token === OFICIOS) {
            this.upsertPersonCore(event.person._id, event.person);
        }

        if (event.token === SALUD) {
            this.upsertPersonCore(event.person._id, event.person);
        }

        if (event.token === COBERTURA) {
            this.upsertPersonCore(event.person._id, event.person);
        }

        if (event.token === ENCUESTA) {
            this.upsertPersonCore(event.person._id, event.person);
        }

        if (event.token === VINCULOS) {
            this.upsertPersonCore(event.person._id, event.person);
        }

    }

    upsertPersonCore(id: string, p: any) {
        this.daoService.partialUpdate<Person>('person', id, p).then(person => {
            this.updateCurrentPerson(person);
        })
    }

    updateCurrentPerson(person: Person) {
        this.currentPerson = person;
        this.personListener.next(this.currentPerson);
        this.personListener.subscribe(p => {

        })
    }

    setCurrentPersonFromUser() {
        let user = this.userService.currentUser;
        if (!user) return;
        this.fetchPersonByUser(user).subscribe(persons => {
            if (persons && persons.length) {
                this.updateCurrentPerson(persons[0]);
            }

        })

    }

    loadPerson(id?) {
        if (id) {
            this.setCurrentPersonFromId(id);

        } else {
            this.setCurrentPersonFromUser();

        }
    }


    setCurrentPersonFromId(id: string) {
        if (!id) return;

        this.fetchPersonById(id).then(p => {
            this.updateCurrentPerson(p);
        });

    }

    fetchPersonById(id: string): Promise<Person> {
        return this.daoService.findById<Person>('person', id);
    }

    fetchPersonByUser(user: UserWeb): Observable<Person[]> {
        let query = {
            userwebId: user._id
        }
        return this.daoService.search<Person>('person', query);
    }
    //// TEST ///
    public testPersonByDNI(tdoc:string, ndoc:string ): Observable<Person[]>{
        let query = {
          tdoc: tdoc,
          ndoc: ndoc
        }
        return this.daoService.search<Person>('person', query)
    
      }  
      public testUserByEmail(email ): Observable<UserWeb[]>{
        let query = {
          email: email,
        }
        return this.daoService.search<UserWeb>('user', query)
    
      }  
}