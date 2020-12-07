import { Injectable } from '@angular/core';
import { BehaviorSubject ,  Subject ,  Observable, of } from 'rxjs';

import { DaoService }    from '../develar-commons/dao.service';
import { devutils } from '../develar-commons/utils';
import { Person, PersonContactData, Address, UpdatePersonEvent }        from '../entities/person/person';
import { UserWeb } from '../entities/user-web/user-web.model';

import { Asistencia, Requirente, AsistenciaSig } from './asistencia/asistencia.model';
import { Turno }         from './turnos/turnos.model';


const CORE = 'core';
const CONTACT = 'contact';
const ADDRESS = 'address';
const FAMILY = 'family';
const OFICIOS = 'oficios';
const SALUD = 'salud';
const COBERTURA = 'cobertura';
const ENCUESTA = 'ambiental';
const ASSETS = 'assets';

const RECORD = 'person';

@Injectable({
	providedIn: 'root'
})
export class PersonService {

  private currentPerson: Person = new Person("");
  public personListener = new BehaviorSubject<Person>(this.currentPerson);

	constructor(
		private daoService: DaoService,
		) 
  {}


  /***************************/
  /******* Person *******/
  /***************************/

  /******* STATE *******/
  get activePerson(): Person{
    return this.currentPerson;
  }

  updateCurrentPerson(person: Person){
    this.currentPerson = person;
    this.personListener.next(this.currentPerson);
  }

  resetCurrentPerson(){
    this.currentPerson = new Person('Anónimo')
  }

  setCurrentPersonFromId(id: string){
    if(!id) return;
    let fetch$ = this.fetchPersonById(id);

    fetch$.then(p => {
      this.updateCurrentPerson(p);
    });

    return fetch$

  }

  setCurrentPersonFromTurno(turno: Turno){
    if(turno && turno.requeridox && turno.requeridox.id){

      this.fetchPersonById(turno.requeridox.id).then(p => {
        this.updateCurrentPerson(p);
      });
    }

  }

  testPersonByDNI(tdoc:string, ndoc:string ): Observable<Person[]>{
    let query = {
      tdoc: tdoc,
      ndoc: ndoc
    }
    return this.daoService.search<Person>(RECORD, query)

  }  


  /******* RETRIEVE *******/
  searchTypeAheadPerson(tdoc: string, term: string): Observable<Person[]> {
      let query = {};
      let test = Number(term);

      if(!(term && term.trim())){
        return of([] as Person[]);
      }

      if(isNaN(test)){
        query['displayName'] = term.trim();
      }else{
        query['tdoc'] = tdoc;
        query['ndoc'] = term;
      }
      
      return this.daoService.search<Person>(RECORD, query);
  }

  fetchPersonById(id: string): Promise<Person>{
    return this.daoService.findById<Person>(RECORD, id);
  }

  fetchPersonByDNI(tdoc:string, ndoc:string ): Subject<Person>{
    let listener = new Subject<Person>();
    let query = {
      tdoc: tdoc,
      ndoc: ndoc
    }
    this.personEmitter(listener, query);
    return listener;
  }  

  fetchPersonByQuery(query: any): Subject<Person[]>{
    let listener = new Subject<Person[]>();
    this.personsEmitter(listener, query);
    return listener;
  }

  private personsEmitter(listener:Subject<Person[]>, query: any){
    this.daoService.search<Person>(RECORD, query).subscribe(tokens =>{
      if(tokens){
        listener.next(tokens)
      }else{
        listener.next([]);
      }
    });
  }

  private personEmitter(listener:Subject<Person>, query: any){
    this.daoService.search<Person>(RECORD, query).subscribe(tokens =>{
      if(tokens && tokens.length){
        listener.next(tokens[0])
      }else{
        listener.next(null);
      }
    });
  }

  loadPersonAddresses(personId): Observable<Address[]>{
    const addresses$ = new Subject<Address[]>();
    this.fetchPersonById(personId).then(p =>{
      if(p && p.locaciones && p.locaciones.length){
        addresses$.next(p.locaciones);
      }else {
        addresses$.next([]);
      }
    })

    return addresses$;
  }

  loadPersonAddressesOptList(personId): Observable<OptionList[]>{
    const token$ = new Subject<OptionList[]>();
    const optList: Array<OptionList> = [];


    this.fetchPersonById(personId).then(p =>{
      if(p && p.locaciones && p.locaciones.length){
        p.locaciones.forEach(t=> {
          optList.push({
            val: t._id,
            label: t.street1 + ' ' + t.barrio + ' ' + t.city,
            barrio: t.barrio,
            city: t.city
          })
        })
        token$.next(optList);

      }else {
        token$.next(optList);
      }
    })

    return token$;

  }





  /******* UPDATE *******/
  updatePerson(event: UpdatePersonEvent){
    this.partialUpdatePerson(event.person._id, event.person);
  }

  partialUpdatePerson(id:string, p:any): Promise<Person>{
    return this.daoService.partialUpdate<Person>(RECORD, id, p).then(person =>{
      if(person){
        this.updateCurrentPerson(person);
        return person;

      }
    })
  }


  /******* UPDATE *******/
  updatePersonPromise(person: Person): Promise<Person>{
    if(!person._id) return null;
    return this.daoService.partialUpdate<Person>(RECORD, person._id, person);    
  }


  /******* CREATE *******/
  createPerson(person: Person) : Promise<Person> {
    return this.daoService.create<Person>(RECORD, person)
  }



  /************************************/
  /******* Person + Asistencia *******/
  /**********************************/

  createPersonFromAsistencia(asistencia: Asistencia){
    let hasDatosMinimos = false;
    let person: Person;
    let requerido: Requirente;
    let hasPerson = this.verificaPersonaEnAsistencia(asistencia);

    if(!hasPerson) {
      hasDatosMinimos = this.verificaDatosMinimos(asistencia);
      if(hasDatosMinimos){
        requerido = asistencia.requeridox;

        person = new Person(requerido.slug);
        this.buildDatosBasicosPerson(person, asistencia)
        this.buildCoberturaPerson(person, asistencia)
        this.buildLocacionPerson(person, asistencia)
        this.daoService.create<Person>(RECORD, person).then(p => {
          if(p){
            this.updatePersonInAsistencia(p, asistencia);
          }
        })

      }
    }

  }

  private updatePersonInAsistencia(p:Person, asistencia: Asistencia){
    asistencia.idPerson = p._id
    asistencia.requeridox.id = p._id
    this.daoService.update<Asistencia>('asisprevencion', asistencia._id, asistencia).then(t =>{
    })

  }

  private buildDatosBasicosPerson(p:Person, asis: Asistencia){
    p.nombre = asis.requeridox.nombre;
    p.apellido = asis.requeridox.apellido;
    p.displayName = asis.requeridox.slug;


    p.tdoc = asis.tdoc;
    p.ndoc = asis.ndoc;
    p.contactdata = [ {
      tdato: 'CEL',
      data:  asis.telefono,
      type: 'PER',
      slug: 'Informado en asistencia',
      isPrincipal: true

    } as PersonContactData]


  }

  private buildCoberturaPerson(p:Person, asis: Asistencia){
    if(asis.osocial){
      p.cobertura = [{
        type: 'cobertura',
        tingreso: 'osocial',
        slug: asis.osocial + ': ' + asis.osocialTxt,
        monto: 0,
        observacion: '',
        fecha: '',
        fe_ts: 0,
        estado: 'activo'
      }]
    }

  }

  private buildLocacionPerson(p:Person, asis: Asistencia){
    let locacion = asis.locacion;
    if(locacion){
      let add = new Address();
      add.slug = 'Informado en asistencia'
      add.street1 = locacion.street1;
      add.streetIn = locacion.streetIn;
      add.streetOut = locacion.streetOut;
      add.city = locacion.city;
      add.barrio = locacion.barrio;

      p.locaciones = [ add ]

    }
  }

  private verificaPersonaEnAsistencia(asistencia: Asistencia): boolean {
    let hasPerson = false;
    let requerido = asistencia.requeridox;
    if(requerido){
      if(requerido.id){
        return true;
      }
    }
    return hasPerson;
  }

  private verificaDatosMinimos(asistencia: Asistencia): boolean {
    let hasMinimos = true;

    if(! (asistencia.ndoc && asistencia.tdoc && asistencia.requeridox && asistencia.requeridox.nombre && asistencia.requeridox.apellido && asistencia.requeridox.slug)){
      hasMinimos = false;
    }

    return hasMinimos;
  }




  /************************************/
  /******* Person + GIS        *******/
  /**********************************/

  addressLookUp(address: Address): Promise<any>{
    return this.daoService.geocodeForward(address);
  }


  fetchMapDataFromAsis(list: Asistencia[]): Subject<AsistenciaSig[]>{
    let sigList$ = new Subject<AsistenciaSig[]>();
    let personList: Array<string> = [];
    let asistenciaList: Array<Asistencia> = [];

    //let collectList$
    let sigList: AsistenciaSig[] = []

    list.forEach(asis => {
      if(asis.requeridox && asis.requeridox.id){ 
        personList.push(asis.requeridox.id);
        asistenciaList.push(asis);
      }
    })

    if(personList.length){
      this.daoService.search<Person>(RECORD, {list: personList}).subscribe(list => {
        if(list && list.length) {
          list.forEach((person, index) => {
            let locaciones = person.locaciones;
            if(locaciones && locaciones.length){
              locaciones.forEach(l => {
                if(l.lat && l.lng){
                  sigList.push({
                    asistencia: asistenciaList[index],
                    locacion: l,
                    lat: l.lat,
                    lng: l.lng
                  })
                }
              })
            }
          })
        }
        sigList$.next(sigList);
      })

    }else{      
        sigList$.next(sigList);
    }

    return sigList$
  }

  ///////////////// INTRODUCIMOS LA POSIBILIDAD DE BUSCAR UNA PERSONAS A PARTIR DE UN USUARIO /////////////
  fetchPersonByUserAGN(user: UserWeb): Observable<Person[]>{
    let query = {
      userwebId: user['_id']
    }
    return this.daoService.search<Person>('person', query);
  }



}//END controller

interface OptionList {
  val: string;
  label: string;
  barrio?: string;
  city?: string;
}
