import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { Observable, of} from 'rxjs';

import { SaludController } from '../../../salud/salud.controller';

import { PersonService } from '../../../salud/person.service';

import { Person, FamilyData, personModel, Address } from '../../../entities/person/person';

import { devutils }from '../../../develar-commons/utils'

import {   Asistencia, HisopadoYa,
          ContextoDenuncia,
          SisaEvent,
          InfectionFollowUp,
          AfectadoFollowUp,
          MuestraLaboratorio,
          AsistenciaHelper } from '../../../salud/asistencia/asistencia.model';

const BADGE_COLOR = ['info', 'info', 'warning', 'warning', 'danger', 'danger', 'danger', 'danger', 'danger', 'danger', 'danger', 'danger', 'danger', 'danger'];



@Component({
  selector: 'vigil-seguimiento-manage',
  templateUrl: './vigil-seguimiento-manage.component.html',
  styleUrls: ['./vigil-seguimiento-manage.component.scss']
})
export class VigilSeguimientoManageComponent implements OnInit {
	@Input() token: Asistencia;
  @Input() viewList = [];
  @Input() showObservacionesPanel = false;
  @Output() personSelected = new EventEmitter<string>();
  @Output() familySelected = new EventEmitter<FamilyData>();
  @Output() coreDataSelected = new EventEmitter<Asistencia>();

	public asistencia: AsistenciaToPrint;
  private prioridad_colors = ['', 'rgba(0,201,0,0.6)', 'rgba(255,189,0,0.9)', 'rgba(255,36,69,0.8)']

  // template helpers
  public showGenericData = false;

  public showSisaData = false;
  public showInfectionData = false;
  public showSeguimientoData = false;
  public showVinculosData = false;
  public showMuestrasData = false;

  public showFollowUp = false;

  public showIcons = false;
  public showIconSisa = true;
  public showIconFollowUp = true;
  public showIconLab = true;
  public showIconCovid = true;

  public sisaData: SisaData;
  public infectionData: InfectionData;
  public seguimiento: SeguimientoData;

  public manageIndizado: Asistencia;

  public muestrasList: MuestraslabData[] = [];
  public vinculosList$: Observable<VinculosData[]>;

  public comorbilidadBadge: ComorbilidadBadge = new ComorbilidadBadge();
  public sisaBadge: SisaBadge = new SisaBadge();
  public covidBadge: CovidBadge = new CovidBadge();
  public fupBadge: FollowUpBadge = new FollowUpBadge();
  public hisopadoBadge: HisopadoBadge = new HisopadoBadge();
  public labBadge: LabBadge = new LabBadge();

  public llamdadosColorBadge = "#3c4e62";
	public covidColorBadge = "#1205a6";


  constructor(
          private perSrv: PersonService,
          private dsCtrl: SaludController,
    ) { }

  ngOnInit() {
  	if(this.token){
      this.asistencia = this.buildCovidData(this.token)
    //   this.buildSisaData(this.token);
    //   this.buildSeguimientoData(this.token);
      this.showIcons = true;
      this.openViewPanels(this.viewList);
  	}
  }

  editVinculo(contacto: VinculosData){
      this.familySelected.next(contacto.token)
  }

  editCoreData(){
      this.coreDataSelected.next(this.token)
  }

  manageBase(e){
    //c o nsole.log('TODO');
  }

  closeFollowUp(e){
    this.showFollowUp = false
  }

  manageCasoIndice(casoIndice){
    if(true){
      this.followUpCasoIndice(this.token)
    }
  }

  manageVinculo(contacto: VinculosData){
    this.showFollowUp = false;
    if(contacto.token.personId){
      this.showFollowUpVinculo(contacto.token.personId);
      //this.personSelected.next(contacto.token.personId);
    }else{
      this.dsCtrl.openSnackBar('Contacto no dado de alta como persona', 'Cerrar');
      //todo

    }
  }

  openDialog(e, target){
  	e.stopPropagation();
  	e.preventDefault();
  }

  private followUpCasoIndice(asistencia: Asistencia){
    let id = asistencia && asistencia.casoIndice && asistencia.casoIndice.parentId;
    if(id){
      this.dsCtrl.fetchAsistenciaById(id).then(asis =>{
        if(asis){
            this.manageIndizado = asis;
            this.showFollowUp = true;

        }else{

          this.dsCtrl.openSnackBar('No se pudo recuperar la solicitud índice', 'Cerrar');
        }
      })

    }else{
      this.dsCtrl.openSnackBar('La solicitud no tiene caso índice', 'Cerrar');

    }

  }

  private showFollowUpVinculo(personId: string){
    this.perSrv.fetchPersonById(personId).then(per => {
      if(per){
        this.dsCtrl.fetchAsistenciaByPerson(per).subscribe(list =>{
          if(list && list.length){
            this.manageIndizado = list[0];
            this.showFollowUp = true;
            //todo

          }else{
          this.dsCtrl.openSnackBar('No hay solicitud de seguimiento para este vínculo', 'Cerrar');

          }


        })
      }else {
        this.dsCtrl.openSnackBar('No fue posible recuperar los datos de la persona', 'Cerrar');
        //todo

      }
    });
  }


  private openViewPanels(list){
    if(!(list && list.length)) return;
    if(list.indexOf('core') !== -1) this.showGenericData = true; else this.showGenericData = false;
    if(list.indexOf('sisa') !== -1) this.buildSisaData(this.token); else this.showSisaData = false;
    if(list.indexOf('seguimiento') !== -1) this.buildSeguimientoData(this.token); else this.showSeguimientoData = false;
    if(list.indexOf('infection') !== -1)   this.buildInfectionData(this.token); else this.showInfectionData = false;
    if(list.indexOf('muestralab') !== -1)  this.buildMuestraLab(this.token); else this.showMuestrasData = false;
    if(list.indexOf('vinculos') !== -1)    this.buildVinculosFam(this.token); else this.showVinculosData = false;

  }


  private buildVinculosFam(token: Asistencia){
    this.showVinculosData = false;
    this.vinculosList$ = new Observable<VinculosData[]>()
    let personId = token.requeridox && token.requeridox.id

    if(!personId){
      this.showVinculosData = false;
      return;
    }

    this.perSrv.fetchPersonById(personId).then(per => {
      if(per){
        let vinculos = per.familiares;

        if(vinculos && vinculos.length){
          this.sortProperly(vinculos);

          let vinculosData = vinculos.map(vin => {
            let vinq = new VinculosData(vin, per);
            this.fetchAsistenciaVinculo(vin, vinq, per)
            return vinq;
          })

          this.vinculosList$ = of(vinculosData);
          this.showVinculosData = true;

        }else {
          this.showVinculosData = false;
          return;

        }

      }else {
        this.showVinculosData = false;
        return;
      }
    })

  }


  private sortProperly(vinculos: FamilyData[]){
    vinculos.sort((fel: FamilyData, sel: FamilyData)=> {
        if((fel.nucleo || 'NUC-HAB-01') < (sel.nucleo || 'NUC-HAB-01') ) return -1;

        else if((fel.nucleo || 'NUC-HAB-01') > (sel.nucleo || 'NUC-HAB-01')) return 1;

        else {
          if((fel.apellido + fel.nombre) < (sel.apellido + sel.nombre) ) return -1;

          else if((fel.apellido + fel.nombre) > (sel.apellido + sel.nombre)) return 1;

          else return 0
        }
    });

  }

  private fetchAsistenciaVinculo(vinculo: FamilyData, vinToken: VinculosData, person: Person){

    this.perSrv.fetchPersonById(vinculo.personId).then(vPerson =>{
      if(vPerson){
        this.dsCtrl.fetchAsistenciaByPerson(vPerson).subscribe(vlist =>{
          if(vlist && vlist.length){
            let asis = vlist[0]
            this.buildIconografiaVinculo(vinToken, vPerson, asis);
          }
        })        
      }

    })

  }

  private buildIconografiaVinculo(vinToken: VinculosData, person: Person, vAsistencia: Asistencia){
    vinToken.labBadge = this.buildLabBadge(vAsistencia);
    vinToken.fupBadge = this.buildFollowUPdBadge(vAsistencia);
    vinToken.covidBadge = this.buildCovidBadge(vAsistencia);
    vinToken.hisopadoBadge = this.buildHisopadoBadge(vAsistencia);
  }

  private buildMuestraLab(token: Asistencia){
    if(!(this.token.muestraslab && this.token.muestraslab.length)){
      this.showMuestrasData = false;
      return;
    }

    this.muestrasList = [];
    this.token.muestraslab.forEach(t =>{
      this.muestrasList.push(new MuestraslabData(t))

    })
    this.showMuestrasData = true;
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
    toPrint.costo =  AsistenciaHelper.getPesoPonderadoCovid(token) + 1
    toPrint.ponderacionColor = `rgba(${250 - (toPrint.costo * 15)} ,${180 - (toPrint.costo * 15)},150,0.6)`

    let epiw = AsistenciaHelper.getSemanaEpidemiologica(token);
    toPrint.epiw = epiw ? "#" + epiw : '';



 
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
    toPrint.solicitante = token.requeridox.slug + (token.fenactx ? ' Fe Nac: '+ token.fenactx + ' ' : ' ')  + (token.edad ? ' ('+ token.edad + ')' : ' ')  + (token.sexo ? ' ('+ token.sexo + ')' : ' ') + (token.contactosEstrechos ? ' #'+ token.contactosEstrechos + ' ' : ' ') +' ::  Tel: ' + (token.telefono || '');
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

    this.comorbilidadBadge = this.buildComorbilidadBadge(token);

    this.sisaBadge = this.buildSisaBadge(token);
    this.covidBadge = this.buildCovidBadge(token);
    this.labBadge = this.buildLabBadge(token);
    this.fupBadge = this.buildFollowUPdBadge(token);
    this.hisopadoBadge = this.buildHisopadoBadge(token);

    this.buildDenuncia(toPrint, token);

    this.buildCasoIndice(toPrint, token);


    return toPrint;
  }


  private buildSisaData(token: Asistencia){
    this.sisaData = new SisaData(token.sisaevent);
    if(!this.token.sisaevent){
      this.showSisaData = false;
      return;
    }

    this.showSisaData = true;
  }


  private buildFollowUPdBadge(asistencia: Asistencia):FollowUpBadge{
    let followupBadgeToken = new FollowUpBadge()
    let token = asistencia.followUp;

    if(token){
      followupBadgeToken.hasData = true;
      let today = new Date();
      let tipoSeguimiento = AsistenciaHelper.getPrefixedOptionLabel('tipoFollowUp', '', token.tipo) ;
      let inicioSeguimiento = token.fets_inicio ? devutils.txDayMonthFormatFromDateNum(token.fets_inicio): ''

      let contactos = asistencia.seguimEvolucion;
      let llamadosCount = 0;
      let diasSeguimiento = Math.floor((today.getTime() - token.fets_inicio) / (1000 * 60 * 60 * 24));
      followupBadgeToken.asignado = token.isAsignado;
      let asignadoTxt = token.isAsignado ? ' - ASIGN: ' + token.asignadoSlug : ''

      followupBadgeToken.toolTip = `Inicio:[${token.fe_inicio}] últ contacto:[${token.fe_ucontacto}] Contactos logrados:[${token.qcontactos}/${token.qllamados}] No contesta:[${token.qIntents}] ${token.slug} ${asignadoTxt} `;
      if(token.fets_nextLlamado){
        followupBadgeToken.nextCall = token.altaVigilancia ? 'ALTA VIGILANCIA': devutils.txFromDateTime(token.fets_nextLlamado);
      }else {
        followupBadgeToken.nextCall = token.altaVigilancia ? 'ALTA VIGILANCIA': '';
      }

      followupBadgeToken.investigAlert = '';
      if(AsistenciaHelper.isCovidActivo(asistencia)){
        let investig = asistencia.sintomacovid;
        if(!(investig && investig.hasInvestigacion)){
          followupBadgeToken.investigAlert = '¡SIN INVESTIGACIÓN!'
        }  
      }

      if(contactos && contactos.length){
        llamadosCount = contactos.length;
      }

      followupBadgeToken.label = tipoSeguimiento + ' ' + inicioSeguimiento + ' #' + diasSeguimiento + ' días';
      followupBadgeToken.qty = token.qcontactos;

      if(!(token.qllamados + token.qcontactos)){
        followupBadgeToken.arrow = 'down'
        followupBadgeToken.fecha = 'sin contacto';
        followupBadgeToken.color = 'danger'

      }else if(     token.lastCall === 'logrado' ){
        followupBadgeToken.arrow = 'top'
        followupBadgeToken.fecha =  token.fets_ullamado ? devutils.txDayMonthFormatFromDateNum(token.fets_ullamado): '';
        followupBadgeToken.color = 'info'

      }else{
        followupBadgeToken.arrow = 'bottom'
        followupBadgeToken.fecha = token.fets_ullamado ? devutils.txDayMonthFormatFromDateNum(token.fets_ullamado): '';
        followupBadgeToken.color = 'success'

      }




    }
    return followupBadgeToken;

  }
  //qty
  
  private buildHisopadoBadge(asistencia: Asistencia):HisopadoBadge{
    let hisopadoBadgeToken = new HisopadoBadge();
    let hisopado = AsistenciaHelper.atencionHisopado(asistencia);
    if(hisopado.needsHisopado){
      hisopadoBadgeToken.hasData = true;
    }
    return hisopadoBadgeToken;
  }


  private buildLabBadge(asistencia: Asistencia):LabBadge{
    let labBadgeToken = new LabBadge()
    let muestras = asistencia.muestraslab;

    if(muestras && muestras.length){
      labBadgeToken.hasData = true;

      muestras.forEach(muestra => {
        let token = new LabBadge()
        token.toolTip = `Estado:[${muestra.estado}] Resul:[${muestra.resultado}] tipo:${muestra.tipoMuestra} FechaToma:[${muestra.fe_toma}] FechaRes:[${muestra.fe_resestudio}] ${muestra.slug}  ${muestra.alerta} `;

        if(muestra.estado === 'presentada'){
          if(muestra.resultado === 'confirmada'){
            token.arrow = 'top'
            token.label = AsistenciaHelper.getPrefixedOptionLabel('resultadoMuestraLab', '', muestra.resultado)
            token.fecha = devutils.txDayMonthFormatFromDateNum(muestra.fets_resestudio);
            token.color = 'danger'

          } else if(muestra.resultado === 'descartada'){
            token.arrow = 'bottom'
            token.label = AsistenciaHelper.getPrefixedOptionLabel('resultadoMuestraLab', '', muestra.resultado)
            token.fecha = devutils.txDayMonthFormatFromDateNum(muestra.fets_resestudio);
            token.color = 'success'

          }else {
            token.arrow = 'right'
            token.label = AsistenciaHelper.getPrefixedOptionLabel('resultadoMuestraLab', '', muestra.resultado)
            token.fecha = devutils.txDayMonthFormatFromDateNum(muestra.fets_toma);
            token.color = 'info'            
          }

        }else{
          token.arrow = 'bottom'
          token.label = AsistenciaHelper.getPrefixedOptionLabel('resultadoMuestraLab', '', muestra.resultado)
          token.fecha = devutils.txDayMonthFormatFromDateNum(muestra.fets_toma);
          token.color = null;
        }
        labBadgeToken.muestras.push(token);


      })
    }
    return labBadgeToken;

  }

  private buildCovidBadge(asistencia: Asistencia): CovidBadge{
    let covidBadgeToken = new CovidBadge()
    let token = asistencia.infeccion;

    if(token){
      covidBadgeToken.hasData = true;
      covidBadgeToken.label = AsistenciaHelper.getPrefixedOptionLabel('metodoDiagnostico', '', token.mdiagnostico) + '::' +  AsistenciaHelper.getPrefixedOptionLabel('avanceInfection', '', token.avance);
      covidBadgeToken.toolTip = `Internado: [${token.locacionSlug}] sintoma:${token.sintoma} ${token.slug}`;

      if(     token.actualState === 0 ){
        covidBadgeToken.arrow = 'left'
        covidBadgeToken.fecha =  token.fets_inicio ? devutils.txDayMonthFormatFromDateNum(token.fets_inicio): '';
        covidBadgeToken.color = 'warning'

      }else if(token.actualState === 1 ){
        covidBadgeToken.arrow = 'top'
        covidBadgeToken.fecha = token.fets_confirma ? devutils.txDayMonthFormatFromDateNum(token.fets_confirma): '';
        covidBadgeToken.color = 'danger'

      }else if(token.actualState === 2 ){
        covidBadgeToken.arrow = 'left'
        covidBadgeToken.fecha = '';
        covidBadgeToken.color = 'success'
 
      }else if(token.actualState === 4 ){
        covidBadgeToken.arrow = 'bottom'
        covidBadgeToken.label = AsistenciaHelper.getPrefixedOptionLabel('estadoActualInfection', '', token.actualState);
        covidBadgeToken.toolTip = `Fallecido: ${token.slug}`;
        covidBadgeToken.fecha =  token.fets_alta ? devutils.txDayMonthFormatFromDateNum(token.fets_alta): '';
        covidBadgeToken.color = 'black'

      }else if(token.actualState === 5 ){
        covidBadgeToken.arrow = 'bottom'
        covidBadgeToken.toolTip = `Alta: ${token.slug}`;
        covidBadgeToken.label = AsistenciaHelper.getPrefixedOptionLabel('estadoActualInfection', '', token.actualState);
        covidBadgeToken.fecha =  token.fets_alta ? devutils.txDayMonthFormatFromDateNum(token.fets_alta): '';
        covidBadgeToken.color = 'success'

      }else if(token.actualState === 6 ){
        covidBadgeToken.arrow = 'left'
        covidBadgeToken.fecha =  token.fets_inicio ? devutils.txDayMonthFormatFromDateNum(token.fets_inicio): '';
        covidBadgeToken.color = null;
      }
    }
    return covidBadgeToken;

  }

  private buildComorbilidadBadge(token: Asistencia): ComorbilidadBadge{
    let badgeToken = new ComorbilidadBadge();
    let q = 0;
    let toolTip = '';
    let sintomas = token.sintomacovid;
    if(sintomas){
      if(sintomas.hasDiabetes){
        toolTip += ' [Diabetes]';
        q += 1;
        badgeToken.hasData = true;

      }
      if(sintomas.hasHta){
        toolTip += ' [HTA]';
        q += 1;
        badgeToken.hasData = true;

      }
      if(sintomas.hasCardio){
        toolTip += ' [Cardio]';
        q += 1;
        badgeToken.hasData = true;

      }

      if(sintomas.hasPulmonar){
        toolTip += ' [Pulmonar]';
        q += 1;
        badgeToken.hasData = true;

      }
 
      if(sintomas.hasEmbarazo){
        toolTip += ' [Embarazada]';
        q += 1;
        badgeToken.hasData = true;

      }

     if(sintomas.hasCronica){
        toolTip += ' [Otras]';
        q += 1;
        badgeToken.hasData = true;

      }

     if(sintomas.hasFumador){
        toolTip += ' [Fumador]';
        q += 1;
        badgeToken.hasData = true;

      }

    if(sintomas.hasObesidad){
        toolTip += ' [Obesidad]';
        q += 1;
        badgeToken.hasData = true;

      }
    }

    if(badgeToken.hasData){
      badgeToken.color = BADGE_COLOR[q];
      badgeToken.toolTip = toolTip;
      badgeToken.branding = 'preexistentes: #' + q;
    }    

    return badgeToken;
  }
  
  private buildSisaBadge(token: Asistencia): SisaBadge{
    let sisaBadgeToken = new SisaBadge();
    
    let sisa = token.sisaevent

    if(sisa){
      sisaBadgeToken.hasData = true;
      sisaBadgeToken.label = AsistenciaHelper.getPrefixedOptionLabel('avanceSisa', '', sisa.avance);
      sisaBadgeToken.toolTip = `Reportado: ${sisa.reportadoPor} Id:${sisa.sisaId} ${sisa.slug}`;

      if(sisa.avance === 'sospecha' ||sisa.avance === 'confirmado'){
        sisaBadgeToken.arrow = 'top'
        sisaBadgeToken.fecha = devutils.txDayMonthFormatFromDateNum(sisa.fets_reportado);
      }else{
        sisaBadgeToken.arrow = 'bottom'
        sisaBadgeToken.fecha = devutils.txDayMonthFormatFromDateNum(sisa.fets_consulta);

      }
    }
    return sisaBadgeToken;
  }

  private buildCasoIndice(target: AsistenciaToPrint, token: Asistencia){
    if(token.casoIndice){
      target.casoIndice = true;
      target.casoIndiceTxt = 'CASO ÍNDICE: ' + token.casoIndice.slug;

    }else{
      target.casoIndice = false;
    }

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

class VinculosData {
  vinculo: string ;
  slug: string; 
  person: Person;

  token: FamilyData;
  labBadge?: LabBadge;
  fupBadge?: FollowUpBadge;
  covidBadge?: CovidBadge;
  hisopadoBadge?: HisopadoBadge;

  constructor(token:FamilyData, per: Person){
    this.token = token;
    this.vinculo = AsistenciaHelper.getPrefixedOptionLabel('vinculosFam', '', token.vinculo);
    this.person = per;
    this.labBadge = new LabBadge();
    this.fupBadge = new FollowUpBadge();
    this.covidBadge = new CovidBadge();
    this.hisopadoBadge = new HisopadoBadge();

    this.slug = token.apellido + ', ' + token.nombre + ' DNI:' + token.ndoc + ' - FeNac: ' + token.fenactx;

  }
}

class MuestraslabData {
  resultado: string ;
  tipoMuestra: string ;
  estado: string;

  token: MuestraLaboratorio;

  constructor(token:MuestraLaboratorio){
    this.token = token;
    this.resultado = AsistenciaHelper.getPrefixedOptionLabel('resultadoMuestraLab', '', token.resultado);
    this.tipoMuestra = AsistenciaHelper.getPrefixedOptionLabel('resultadoMuestraLab', '', token.tipoMuestra);
    this.estado = AsistenciaHelper.getPrefixedOptionLabel('resultadoMuestraLab', '', token.estado);

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

class SisaBadge {
  hasData = false;
  color = 'info';
  border = false;
  outline = true;
  arrow = 'bottom';
  size = '';
  branding = 'S';
  label = '';
  fecha = '';
  toolTip = '';
}

class ComorbilidadBadge {
  hasData = false;
  color = 'info';
  border = false;
  outline = true;
  arrow = 'bottom';
  size = '';
  branding = 'X';
  label = '';
  fecha = '';
  toolTip = '';
  qty = 0;
}

class CovidBadge {
  hasData = false;
  color = 'info';
  border = false;
  outline = true;
  arrow = 'bottom';
  size = '';
  branding = 'C19';
  label = '';
  fecha = '';
  toolTip = '';
}

class HisopadoBadge {
  hasData = false;
  color = 'warning';
  border = false;
  outline = true;
  arrow = 'bottom';
  size = '';
  branding = 'H!';
  label = '';
  fecha = '';
  toolTip = '';
  qty = 0;
}

class FollowUpBadge {
  hasData = false;
  color = 'info';
  border = false;
  outline = true;
  arrow = 'bottom';
  asignado = false;
  nextCall = '';
  investigAlert = '';
  size = '';
  branding = 'LL';
  label = '';
  fecha = '';
  toolTip = '';
  qty = 0;
}

class LabBadge {
  hasData = false;
  color = 'info';
  border = false;
  outline = true;
  arrow = 'bottom';
  size = '';
  branding = 'LAB';
  label = '';
  fecha = '';
  toolTip = '';
  muestras: Array<LabBadge> = [];
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
    epiw: string = '';

    casoIndiceTxt: string = '';
    casoIndice: boolean = false;

    isNuevo:boolean = false;



}
