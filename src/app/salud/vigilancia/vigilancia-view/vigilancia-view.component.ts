import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';

import {   Asistencia, 
          ContextoDenuncia,
          SisaEvent,
          InfectionFollowUp,
          AfectadoFollowUp,
          AsistenciaHelper } from '../../asistencia/asistencia.model';

const COSTO = [1, 2, 3, 4, 6, 7, 8, 9, 10, 11];



@Component({
  selector: 'vigilancia-view',
  templateUrl: './vigilancia-view.component.html',
  styleUrls: ['./vigilancia-view.component.scss']
})
export class VigilanciaViewComponent implements OnInit {
	@Input() token: Asistencia;
  @Input() viewList = [];

	public asistencia: AsistenciaToPrint;
  private prioridad_colors = ['', 'rgba(0,201,0,0.6)', 'rgba(255,189,0,0.9)', 'rgba(255,36,69,0.8)']

  // template helpers
  public showGenericData = false;

  public showSisaData = false;
  public showInfectionData = false;
  public showSeguimientoData = false;

  public sisaData: SisaData;
  public infectionData: InfectionData;
  public seguimiento: SeguimientoData;

  constructor() { }

  ngOnInit() {

  	if(this.token){
      this.asistencia = this.buildCovidData(this.token)
    //   this.buildSisaData(this.token);
    //   this.buildSeguimientoData(this.token);

      this.openViewPanels(this.viewList);

  	}


  }

  private openViewPanels(list){
    if(!(list && list.length)) return;
    if(list.indexOf('core') !== -1) this.showGenericData = true; else this.showGenericData = false;
    if(list.indexOf('sisa') !== -1) this.buildSisaData(this.token); else this.showSisaData = false;
    if(list.indexOf('seguimiento') !== -1) this.buildSeguimientoData(this.token); else this.showSeguimientoData = false;
    if(list.indexOf('infection') !== -1) this.buildInfectionData(this.token); else this.showInfectionData = false;

  }

  private buildInfectionData(token: Asistencia){
    if(!this.token.infeccion){
      this.showInfectionData = false;
      return;
    }

    this.infectionData = new InfectionData(token.infeccion);
    this.showInfectionData = true;
  }


  private buildSeguimientoData(token: Asistencia){
    if(!this.token.followUp){
      this.showSeguimientoData = false;
      return;
    }

    this.seguimiento = new SeguimientoData(token.followUp);
    this.showSeguimientoData = true;
  }


  private buildSisaData(token: Asistencia){
    if(!this.token.sisaevent){
      this.showSisaData = false;
      return;
    }

    this.sisaData = new SisaData(token.sisaevent);
    this.showSisaData = true;
  }


  private buildCovidData(token: Asistencia): AsistenciaToPrint{
    let covid = token.sintomacovid;
    let toPrint = new AsistenciaToPrint();

    let tipo = token.tipo || 1;
    let iCount = this.countIntervenciones(token);

    toPrint.isNuevo = (iCount <= 1);

    token.prioridad = token.prioridad || 2;
    toPrint.prioridad = AsistenciaHelper.getPrefixedOptionLabel('prioridad', 'Prioridad', token.prioridad);

    toPrint.prioridadColor = this.prioridad_colors[token.prioridad]
    toPrint.intervenciones = iCount >= 1 ? iCount - 1: iCount;
    toPrint.costo = COSTO[this.getPesoAsistencia(token)];
    toPrint.ponderacionColor = `rgba(${250 - (toPrint.costo * 15)} ,${180 - (toPrint.costo * 15)},150,0.6)`

 
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
    toPrint.solicitante = token.requeridox.slug + (token.requeridox.edad ? ' ('+ token.requeridox.edad + ')' : ' ')  + (token.requeridox.sexo ? ' ('+ token.requeridox.sexo + ')' : ' ') + ' ::  CEL: ' + token.telefono;
    toPrint.cPrefix = token.compPrefix;
    toPrint.dni  = 'DNI: ' + token.ndoc; 
    toPrint.cName = token.compName;
    toPrint.cNum = 'ID: ' + token.compNum;  
    toPrint.slug = token.slug;
    toPrint.description = token.description;
    toPrint.fecha = token.fecomp_txa;
    toPrint.estado =  AsistenciaHelper.getPrefixedOptionLabel('estado', 'Estado', token.estado);
    toPrint.avance =  AsistenciaHelper.getPrefixedOptionLabel('avance', token.estado, token.avance);
    toPrint.locacionTxt = this.buildDireccion(token)

    this.buildDenuncia(toPrint, token);

    return toPrint;
  }

  private countIntervenciones(token: Asistencia):number {
    let count = token && token.novedades && token.novedades.length;
    count = count || 0;

    return count;
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

  private getPesoAsistencia(asis: Asistencia): number{
    let peso = 0;
    let covid = asis.sintomacovid;

    if( !covid ) return peso;
    peso += (covid.hasFiebre ? (covid.fiebre > 38 ? 2: 1) : 0);
    peso += ( covid.hasDifRespiratoria ? 2: 0);
    peso += ( (covid.hasDolorGarganta || covid.hasTos )? 1: 0);
    peso += ( (covid.hasViaje || covid.hasContacto || covid.hasEntorno) ? 3: 0);

    if(peso>8) peso = 8

    return peso;
  }



}

class SeguimientoData {
  token: AfectadoFollowUp
  vector: string; 
  tipo: string; 
  lastCall: string; 

  constructor(token:AfectadoFollowUp){
    this.token = token;

    this.vector = AsistenciaHelper.getOptionLabel('vectorSeguim', token.vector);
    this.tipo = AsistenciaHelper.getOptionLabel('tipoFollowUp', token.tipo);
    this.lastCall = AsistenciaHelper.getOptionLabel('resultadoSeguim', token.lastCall);


  }
}

class InfectionData {
  token: InfectionFollowUp
  actualState: string; 
  avance: string; 
  sintoma: string; 

  constructor(token:InfectionFollowUp){
    this.token = token;

    this.actualState = AsistenciaHelper.getOptionLabel('estadoActualInfection', token.actualState);
    this.avance =      AsistenciaHelper.getOptionLabel('avanceInfection', token.avance);
    this.sintoma =     AsistenciaHelper.getOptionLabel('sintomaInfection', token.sintoma);


  }
}


class SisaData {
  sisaevent: SisaEvent
  avance: string;

  constructor(sisa:SisaEvent){
    this.sisaevent = sisa;
    this.avance = AsistenciaHelper.getPrefixedOptionLabel('avanceSisa', 'calificado como ', sisa.avance);
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
    dni: string = '';
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
    intervenciones: number = 0;
    costo: number = 0;
    ponderacionColor:string;
    prioridadColor: string;
    prioridad: number = 2;

    isNuevo:boolean = false;

}

