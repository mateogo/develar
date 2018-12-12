import { Component, OnInit } from '@angular/core';
import { Ciudadano, ciudadanoDefaultFactory } from '../../../antecedentes/model/antecedente';

import { Antecedente, ImputacionInfracciones, antecedenteDefaultFactory } from '../../../antecedentes/model/antecedente';
import { ModelHelper } from '../../../antecedentes/model/antecedentes-helper';
import { devutils } from '../../../develar-commons/utils';

import { DaoService } from '../../../develar-commons/dao.service';

@Component({
  selector: 'antecedentes-home',
  templateUrl: './antecedentes-page.component.html',
  styleUrls: ['./antecedentes-page.component.scss']
})
export class AntecedentesPageComponent implements OnInit {
  public searchSuccess = false;

  public hasAntecedentes = false;
  public hasScoring = false;

  public triggerAntecedentes = false;
  public triggerScoring = false;
  public ciudadano: Ciudadano;
  public antecedentes: Antecedente[];
  public scoring = {};

  constructor(
  		private daoService: DaoService
  	) { }

  ngOnInit() {
  }

  searchAntededentes(){
    this.hasAntecedentes = false;

  	this.loadAntecedentes();

  	console.log('busco Antededentes')
  	if(this.searchSuccess){
  		this.triggerAntecedentes = true;
  		this.triggerScoring = false;
  	}else{  		
  		this.triggerAntecedentes = false;
  		this.triggerScoring = false;
  	}
  }

  searchScoring(){
  	console.log('busco scoring')
    this.hasAntecedentes = false;


  	this.loadAntecedentes();

  	console.log('busco Antededentes')
  	if(this.searchSuccess){
  		this.triggerAntecedentes = false;
  		this.triggerScoring = true;
  	}else{  		
  		this.triggerAntecedentes = false;
  		this.triggerScoring = false;
  	}
  }

  searchPerson(person){
  	console.log('searchPerson');

  	if(person){
  		this.searchSuccess = true;
  		this.ciudadano = person;

  	}else{
  		this.searchSuccess = false;
  		this.ciudadano = null;
  	}
  }

  loadAntecedentes(){
  	this.hasScoring = false;
  	this.hasAntecedentes = false;

  	console.log('loadAntecedentes: [%s]');
  	let query = this.buildQuery();

    this.daoService.search<Antecedente>('antecedente', query).subscribe(records =>{
      console.log('SearchOK');
      if(records && records.length){
      	console.log('Recuperados [%s]', records.length)
      	this.antecedentes = records;

      	this.scoring = this.evaluateScoring();

      }else{
      	this.antecedentes = [];
      }
      this.hasAntecedentes = true;

    })


  }
  evaluateScoring(){
  	let puntos = 0;
  	let inhab = 0;
  	let signo = 1;

  	let scoring = {
  		puntos: 20,
  		inhab: 0
  	}

  	this.antecedentes.forEach(token =>{
  		if(token.tipo=== 'inhabilitacion') {
  			inhab +=1;
  		}else{
  			if(token.tipo === 'infraccion') signo = 1;
  			else if(token.tipo === 'curso') signo = -1;
  			else signo=0;

	  		token.imputaciones.forEach(falta =>{
	  			puntos += ModelHelper.fetchPuntosFromImputacion(falta.tipo) * signo
	  		})
  	}
  	});
  	scoring.puntos = 20 - puntos;
  	scoring.inhab = inhab;
  	this.hasScoring = true;
  	return scoring;
  }



  buildQuery(){
  	let q = {
  		tdoc_conductor: this.ciudadano.tdoc,
  		ndoc_conductor: this.ciudadano.ndoc
  	}
  	return q;
  }

}
