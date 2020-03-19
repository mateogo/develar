import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';

import {   Asistencia, 
          AsistenciaTable,
          AsistenciaBrowse,
          ContextoDenuncia,
          AsistenciaHelper } from '../../../asistencia/asistencia.model';


@Component({
  selector: 'solcovid-view',
  templateUrl: './solcovid-view.component.html',
  styleUrls: ['./solcovid-view.component.scss']
})
export class SolcovidViewComponent implements OnInit {
	@Input() token: Asistencia;

	public asistencia: AsistenciaToPrint;

  constructor() { }

  ngOnInit() {
  	if(this.token){
  		this.asistencia = this.buildCovidData(this.token)
  	}
  }



  private buildCovidData(token: Asistencia): AsistenciaToPrint{
    let covid = token.sintomacovid;
    let toPrint = new AsistenciaToPrint();

    let tipo = token.tipo || 1;

    if(tipo === 2){
    	toPrint.isDenuncia = true;
    	toPrint.isAsistencia = false;

    }else {
    	toPrint.isDenuncia = false;
    	toPrint.isAsistencia = true;

    }

    if(covid){
      toPrint.indicacion = covid.indicacion;
      toPrint.fiebreTxt = covid.hasFiebre ? covid.fiebreTxt + ' :: ' + covid.fiebre + 'C' :  covid.fiebreTxt ;
      toPrint.sintomasTxt = 'Sintomas: ' + (covid.hasDifRespiratoria ? ' + DIF RESPIRATORIA':'') + (covid.hasTos ? ' + TOS':'') + (covid.hasDolorGarganta ? ' + DolorGarganta':'') + (covid.sintomas ? ' = ' + covid.sintomas :'') 
      toPrint.contagioTxt = 'Contexto: ' + (covid.hasViaje ? ' + VIAJÓ':'') + (covid.hasContacto ? ' + CONTACTO C/COVID':'') + (covid.hasEntorno ? ' + ENTORNO C/COVID':'');
      toPrint.contexto = covid.contexto;
    }

    toPrint.action = AsistenciaHelper.getPrefixedOptionLabel('actions', '', token.action);
    toPrint.sector = AsistenciaHelper.getPrefixedOptionLabel('sectores', 'Sector', token.sector);
    toPrint.solicitante = token.requeridox.slug + (token.edad ? '('+ token.edad + ')' : '')  + (token.sexo ? '('+ token.sexo + ')' : '') + ' :: DNI: ' + token.ndoc + ' ::  ' + token.telefono;
    toPrint.cPrefix = token.compPrefix;
    toPrint.cName = token.compName;
    toPrint.cNum = token.compNum;  
    toPrint.slug = token.slug;
    toPrint.description = token.description;
    toPrint.fecha = token.fecomp_txa;
    toPrint.estado =  AsistenciaHelper.getPrefixedOptionLabel('estado', 'Estado', token.estado);
    toPrint.avance =  AsistenciaHelper.getPrefixedOptionLabel('avance', token.estado, token.avance);
    toPrint.locacionTxt = this.buildDireccion(token)

    this.buildDenuncia(toPrint, token);

    return toPrint;
  }


  private buildDenuncia(target: AsistenciaToPrint, token: Asistencia){
    let data = token.denuncia|| new ContextoDenuncia()

    target.denunciante = data.denunciante;
    target.dendoc = data.dendoc;
    target.dentel = data.dentel;
    target.inombre = data.inombre;
    target.iapellido = data.iapellido;
    target.islug = data.islug;
  }

  private buildDireccion(token: Asistencia): string {
    let direccion = '';
    let data = token.locacion;

    if(data){
      direccion = data.street1
      if(data.streetIn || data.streetOut){
        if(data.streetIn && data.streetOut){
          direccion += 'Entre: ' + data.streetIn + ' y ' + data.streetOut;

        }else {
          direccion += 'Esquina: ' + data.streetIn + ' ' + data.streetOut;
        }
      }

      direccion += ' : ' + data.city 
      direccion += ' : ' + data.barrio

    }
    return direccion;
  }



}

class AsistenciaToPrint {
		isDenuncia: boolean = false;
		isAsistencia: boolean = false;
    indicacion: string = '' ;
    fiebreTxt: string = '' ;
    sintomasTxt: string = '' ;
    contagioTxt: string = '' ;
    contexto: string = '' ;
    action: string = '' ;
    sector: string = '' ;
    solicitante: string = '' ;
    cPrefix: string = '' ;
    cName: string = '' ;
    cNum: string = '' ;
    slug: string = '' ;
    description: string = '' ;
    fecha: string = '' ;
    estado: string = '' ;
    avance: string = '' ;
    locacionTxt: string = '' ;

    denunciante: string; 
    dendoc: string;
    dentel: string;
    inombre: string;
    iapellido: string; 
    islug: string; 

}

