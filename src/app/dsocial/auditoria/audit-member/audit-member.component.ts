import { Component, OnInit, Input } from '@angular/core';

import { Observable } from 'rxjs';

import { DsocialController } from '../../dsocial.controller';

import { Person, personModel, SaludData, CoberturaData, FamilyData, Address } from '../../../entities/person/person';

import { devutils }from '../../../develar-commons/utils'


@Component({
  selector: 'audit-member',
  templateUrl: './audit-member.component.html',
  styleUrls: ['./audit-member.component.scss']
})
export class AuditMemberComponent implements OnInit {
	@Input() person: Person;

	public familyList: FamilyToken[] = [];
	public hasFamilyMembers = false;

	public saludList: SaludData[] = [];
	public hasSaludEvents = false;

	public coberturaList: CoberturaData[] = [];
	public hasCobertura = false;

	public parentList: FamilyToken[] = [];
	public isFamilyMember = false;

	public locationList: FamilyToken[] = [];
	public hasSameLocation = false;


  constructor(
  		private dsCtrl: DsocialController,

  	) { }

  ngOnInit() {
  	if(this.person){
  		this.processPerson(this.person);

  	}

  
  }

  private processPerson(person: Person){
  	this.hasFamilyMembers = false;
  	this.isFamilyMember = false;
  	this.hasSaludEvents = false;

  	if(person.salud && person.salud.length){
  		this.saludList = person.salud;
  		this.hasSaludEvents = true;

  	}

  	if(person.cobertura && person.cobertura.length){
  		this.coberturaList = person.cobertura;
  		this.hasCobertura = true;

  	}

  	this.searchParentFamily(person);
  	this.auditLocaciones(person);

  	let familiares = person.familiares;
  	if(familiares && familiares.length){
  		this.familyList = familiares.map(fam => this.familyToken(fam));
  		this.fetchOwnFamilyData(familiares, this.familyList);


  		this.hasFamilyMembers = true;
  	}

  }

  private auditLocaciones(person: Person){
  	this.locationList = [];
  	let locaciones = person.locaciones;
  	if(locaciones && locaciones.length){
  		locaciones.forEach(locacion => {
  			this.searchSameLocation(person, locacion);

  		});

  	}
  	setTimeout(() => {
  		if(this.locationList.length){
  			this.hasSameLocation = true;
  		}

  	}, 500)

  }

  private searchSameLocation(person: Person, locacion: Address){
  	if(!person || !person._id) return;
  	let query = {
  		mismalocacion: true,
  		personId: person._id,
  		street1: locacion.street1,
  		city: locacion.city
  	}

  	this.dsCtrl.fetchPersonByQuery(query).subscribe(list => {
  		if(list && list.length){
  			console.log('fetchPersonByQuery[%s] [%s]', list.length, list[0].displayName);

  			list.forEach(person_locacion =>{
  				this.locationList.push(this.familyTokenFromPerson(person_locacion, person))

  			})
  		}
  	})

  }

  private searchParentFamily(person: Person){
  	this.parentList = [];
  	if(!person || !person._id) return;
  	let query = {familiar: person._id}

  	this.dsCtrl.fetchPersonByQuery(query).subscribe(list => {
  		if(list && list.length){
  			console.log('fetchPersonByQuery[%s] [%s]', list.length, list[0].displayName);
  			this.parentList = list.map(prnt => this.familyTokenFromPerson(prnt, person));
  			this.isFamilyMember = true;
  		}
  	})

  }



  private fetchOwnFamilyData(familiares: FamilyData[], familyList: FamilyToken[]){
  	familiares.forEach((fam, index) => {
  		let id = fam.personId;
  		if(id && fam.hasOwnPerson){
  			this.dsCtrl.fetchPersonById(id).then(child =>{
  				let alert = this.auditChild(child);
  				familyList[index].inverted = alert;

  			});
  		}

  	});






  }

  private auditChild(person: Person): string{
  	let data ="";
  	let cobertura = person.cobertura;
  	if(cobertura && cobertura.length){
  		data += 'Tiene COBERTURA: ';
  		cobertura.forEach(t=>{
  			data += t.slug + "/ ";
  		})
  	}


  	return data;
  }

  private familyTokenFromPerson(member: Person, related_person: Person): FamilyToken {
  	let pname, pdoc, edad, edadTxt, vinculoTxt, ocupacion, estado, neducativo, inverted;

  	pname = personModel.getPersonDisplayName(member);
  	pdoc = personModel.getPersonDocum(member);
    if(member.fenac){
      edad = devutils.edadActual(new Date(member.fenac));
    }else{
      edad = 0
    }
    edadTxt = edad ? '(' + edad + ')' : '';

  	let familiares = member.familiares;
    vinculoTxt = "V1";
    ocupacion = "";
    estado = "";

  	if(familiares && familiares.length){

  		let token = familiares.find(fam => fam.personId === related_person._id);
  		if(token){
    			vinculoTxt = personModel.getVinculo(token.vinculo);
    			vinculoTxt = vinculoTxt ? "Vínculo: " + vinculoTxt : "v2";
    			
    			ocupacion = personModel.getProfesion(token.tocupacion);
    			ocupacion = ocupacion ? "Ocupación: " + ocupacion : "";
    			estado = personModel.getEstadoVinculo(token.estado);
  		}

  	}
    
    neducativo = personModel.getNivelEducativo(member.nestudios);
    neducativo = neducativo ? "Nivel educativo: " + neducativo: "";
    inverted = this.auditChild(member);

    return { pname, pdoc, edad, edadTxt, vinculoTxt, ocupacion, estado, neducativo, inverted } as FamilyToken;

  }



  private familyToken(member: FamilyData): FamilyToken {
  	let pname, pdoc, edad, edadTxt, vinculoTxt, ocupacion, estado, neducativo;

  	pname = personModel.getPersonDisplayName(member);
  	pdoc = personModel.getPersonDocum(member);
    if(member.fenac){
      edad = devutils.edadActual(new Date(member.fenac));
    }else{
      edad = 0
    }
    edadTxt = edad ? '(' + edad + ')' : '';

    vinculoTxt = "Vínculo: " + personModel.getVinculo(member.vinculo);
    estado = personModel.getEstadoVinculo(member.estado);

    ocupacion = personModel.getProfesion(member.tocupacion)
    ocupacion = ocupacion ? "Ocupación: " + ocupacion : "";
    
    neducativo = personModel.getNivelEducativo(member.nestudios);
    neducativo = neducativo ? "Nivel educativo: " + neducativo: "";


    return { pname, pdoc, edad, edadTxt, vinculoTxt, ocupacion, estado, neducativo } as FamilyToken;

  }

	updateSaludList(e){

	}

	updateCoberturaList(e){

	}

}

//http://develar-local.co:4200/dsocial/gestion/validacionentregas/5cf7c5c4d8304e06a9cb0cd6
// 13416952

interface FamilyToken {
	pname: string;
	pdoc: string;
	edad: number;
	edadTxt: string;
	vinculoTxt: string;
	ocupacion: string;
	estado: string;
	neducativo: string;
	inverted?: string;
}
