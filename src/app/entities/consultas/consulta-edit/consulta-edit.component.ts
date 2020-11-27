import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConsultasService } from '../consultas.service';
import { ConsultaHelper } from '../consulta.helper';
import { Consulta, ConsultaTable } from '../consulta.model';
import { devutils } from '../../../develar-commons/utils';
import { NotificationService } from '../../../develar-commons/notifications.service';
import { ConsultaToTurnoComponent } from '../consulta-to-turno/consulta-to-turno.component';
import { MatDialog } from '@angular/material/dialog';
import { Turno, RequirenteTurno } from '../../turnos/turno.model';
import { PersonService } from '../../person/person.service';
import { TurnosService } from '../../turnos/turnos.service';
import { User } from '../../user/user';
import { UserService } from '../../user/user.service';
import { UserWeb } from '../../user-web/user-web.model';

const ESTADO_END = 'cerrado';
const GENERO_TURNO = 'generoturno';
const SOLICITANTE = 'solicitante';
@Component({
  selector: 'app-consulta-edit',
  templateUrl: './consulta-edit.component.html',
  styleUrls: ['./consulta-edit.component.scss']
})
export class ConsultaEditComponent implements OnInit {
  public form: FormGroup;
  public sedesList = [];
  public tipoConsultaList = [];
  public estadosList = [];
  public estadoAvanceList = [];
  public ejecucionList = [];
  public sectoresList = [];
  public minDate: Date;
  public isCerrado : boolean = true;
  public availableSlots = [];

  public user: User;

  private idConsulta: string;
  public isAsesoramiento = false;
  public isMaterial = false;
  public isConsulta = false;
  public consulta: Consulta;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _consultaService: ConsultasService,
    private _notificationService: NotificationService,
    private _dialogService: MatDialog,
    private _personService: PersonService,
    private _turnoService: TurnosService
  ) {

    this.tipoConsultaList = ConsultaHelper.getOptionList('consultaType');
    this.estadosList = ConsultaHelper.getConsultaEstadosList();
    this.ejecucionList = ConsultaHelper.getOptionList('ejecucion');
    this.sectoresList = ConsultaHelper.getOptionList('sectores');

    this.idConsulta = this._route.snapshot.params.id;
    this.form = this._fb.group({

      // EDICIÓN DE INTERVENCIÓN
      novedad_tx: [null],
      fe_necesidad: [null],
      ejecucion: [null, Validators.required],

      //EDICIÓN DE PASES
      nuevo_sector: [null],
      tx_pase: [null]

    });
  }

  ngOnInit(): void {
    this._consultaService.fetchById(this.idConsulta).then(consulta => {
      this.consulta = consulta;
      this.isCerrado = consulta.estado === 'cerrado' ? false : true;
      this.initForm(consulta);
    })
    this.user = this._userService.currentUser;
  }

  private initForm(consulta: Consulta): void {

    this.isAsesoramiento = consulta.asesoramiento ? true : false;
    this.isMaterial = consulta.material ? true : false;
    this.minDate = devutils.dateFromTx(consulta.fe_necesidad);
    this.form.reset({
      fe_necesidad: consulta ? devutils.dateFromTx(consulta.fe_necesidad) : null
    });

  }




  public doCancelEdit(): void {
    this.volver();
  }

  public doEditTurno(): void {
    const fvalue = this.form.value;

    const consulta = new Consulta();
    consulta._id = this.consulta._id;
    consulta.fe_necesidad = devutils.txFromDate(fvalue.fe_necesidad);
    consulta.fets_necesidad = new Date(fvalue.fe_necesidad).getTime();
    consulta.ejecucion = fvalue.ejecucion;

    let estado = this.ejecucionList.find(e => e.val === fvalue.ejecucion).estado;
    consulta.estado = estado
    consulta.hasCumplimiento = this.consulta.fe_necesidad !== fvalue.fe_necesidad ? true : false;
    consulta.description = this.consulta.description;
    consulta.sector = fvalue.nuevo_sector;


    const pase = ConsultaHelper.generarPaseFValue(fvalue, this.user)

    consulta.pases = this.consulta.pases;
    consulta.pases.push(pase);

    //c onsole.log("consulta -> [%o]", consulta)
    this._consultaService.edit(consulta._id, consulta)
      .then(result => {

        this.volver();
        this._notificationService.success('Consulta editada con éxito')
      })
      .catch(error => {
        this._notificationService.error("No se han podido actualizar los datos")
      });
  }

  changeSelectionValue(type, val) {

    if (type === 'type') {
      this.isConsulta = val === 'consulta' ? true : false;
      this.isAsesoramiento = val === 'asesoramiento' ? true : false;
      this.isMaterial = val === 'solmaterial' ? true : false;
    }

  }

  doCrearTurno(): void {
    let consulta = new ConsultaTable();
    consulta.descripcion = this.consulta.description;

    const dialogRef = this._dialogService.open(ConsultaToTurnoComponent, {
      data: consulta
    });

    dialogRef.afterClosed().subscribe(result => {
      // result contiene los datos cargados en el formulario del
      // popup, con los que se creará el turno
      if (result && result.data) {
        const turno = new Turno();
        turno.requirente = new RequirenteTurno();

        //c onsole.log(result.data);

        turno.estado = 'activo';
        turno.avance = 'noconfirmado';
        turno.tipoConsulta = result.data.tipoConsulta;
        turno.sede = result.data.sede;
        turno.detalle = result.data.detalle;
        turno.txFecha = devutils.datePickerToTx(result.data.txFecha);
        turno.txHora = result.data.txHora.slug;
        turno.tsFechaHora = devutils.dateFromTx(turno.txFecha + ' ' + turno.txHora).getTime();
        turno.source = 'admin';
        turno.turnoId = result.data.turnoId;

        // Para completar correctamente el turno, obtengo los datos de la persona
        const usuarioAgn = new UserWeb();
        usuarioAgn._id = this.consulta.requirente.userId;
        this._personService.fetchPersonByUserWeb(usuarioAgn).subscribe(person => {
          if (person && person.length > 0) {
            turno.requirente.userId = this.consulta.requirente.userId;
            turno.requirente.personId = person[0]._id;
            turno.requirente.ndoc = person[0].ndoc;
            turno.requirente.displayName = person[0].displayName;

            this._turnoService.create(turno).then(turnoResult => {
              if (turnoResult) {
                this.consulta.estado = ESTADO_END;
                this.consulta.sector = SOLICITANTE;
                this.consulta.ejecucion = GENERO_TURNO;

                const pase = ConsultaHelper.generarPaseFromTurno(this.consulta, this.user);

                this.consulta.pases.push(pase);

                this._consultaService.edit(this.consulta._id, this.consulta).then(consultaResult => {
                  this.volver();
                  //c onsole.log('EDITADA OOOOK!');
                });
              } else {
                // TODO: Handle error
              }
            });
          } else {
            // TODO: Handle error
          }
        });
      }
    });
  }

  volver(): void {
    this._router.navigate(['../..'], { relativeTo: this._route });
  }

  getLabel(type : string, key : string) {
    return ConsultaHelper.getOptionLabel(type,key);
  }


}
