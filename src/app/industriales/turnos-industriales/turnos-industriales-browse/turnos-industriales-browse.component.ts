import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { devutils } from '../../../develar-commons/utils';
import { Atendido, Consulta, Pase } from '../../../entities/consultas/consulta.model';
import { ConsultasService } from '../../../entities/consultas/consultas.service';
import { Turno } from '../../../entities/turnos/turno.model';
import { TurnosService } from '../../../entities/turnos/turnos.service';
import { UserWeb } from '../../../entities/user-web/user-web.model';
import { UserService } from '../../../entities/user/user.service';
import { TurnosIndustrialesDialogConfirmationComponent } from '../turnos-industriales-dialog-confirmation/turnos-industriales-dialog-confirmation.component';
import { TurnosIndustrialesDialogConsultaComponent } from '../turnos-industriales-dialog-consulta/turnos-industriales-dialog-consulta.component';
const ESTADO_ACTIVO = 'activo';
const SECTOR_INICIAL = 'comunicacion';
const ENEJECUCION = 'enejecucion';
const EMITIDO = 'emitido';
@Component({
  selector: 'app-turnos-industriales-browse',
  templateUrl: './turnos-industriales-browse.component.html',
  styleUrls: ['./turnos-industriales-browse.component.scss']
})
export class TurnosIndustrialesBrowseComponent implements OnInit {

  public turneraTurnosList$: Observable<Turno[]>;

  public _user$: BehaviorSubject<UserWeb>;
  private user: UserWeb;

  private turnosList: Turno[];

  constructor(
    private _turnoService: TurnosService,
    private _consultaService: ConsultasService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _dialog: MatDialog,
    private _userService : UserService
  ) { }

  ngOnInit(): void {
    this.initTurneraTurnosList();
  }

  private initTurneraTurnosList(): void {
    this._userService.userEmitter.subscribe(user => {
      if (user && user._id) {
        this.user = new UserWeb();
        Object.assign(this.user,user);
        this.turneraTurnosList$ = this._turnoService.fetchTurnoFromUser(this.user);

        this.turneraTurnosList$.subscribe(turnos => {
          this.turnosList = turnos;
        });
      }
    });
  }

  gotoTurneraAlta(): void {
      this.openHasTurnoActivoDialog().subscribe(response => {
        if (response.result === true) {
          const pase = new Pase();
          const consulta = new Consulta();

          pase.ejecucion = EMITIDO;
          pase.novedadTx = 'Inicio de la consulta';
          pase.sector = SECTOR_INICIAL;
          pase.paseTx = '';
          pase.estado = ESTADO_ACTIVO;
          pase.isCumplida = false;
          pase.fe_nov = devutils.txFromDate(new Date());
          pase.ho_nov = devutils.txFromHora(new Date());
          pase.fets_nov = new Date().getTime();
          pase.atendidox = new Atendido();
          pase.atendidox.userWebId = this.user._id;
          pase.atendidox.slug = this.user.nombre + ' ' + this.user.apellido;
          consulta.sector = SECTOR_INICIAL;
          consulta.ejecucion = pase.ejecucion;
          consulta.pases.push(pase);
          consulta.type = response.data.type;
          consulta.description = response.data.description;
          consulta.estado = ESTADO_ACTIVO;

          this._consultaService.manageConsulta(consulta, this.user).subscribe(value => {
            if (value) {
              this._router.navigate(['dashboard']);
            }
          });
        }
      });
  }

  gotoDashboard(): void {
    this._router.navigate(['dashboard']);
  }

  doCancelTurno(turnoId): void {
    this.openConfirmationDialog().subscribe(doCancelation => {
      if (doCancelation) {
      this._turnoService.deleteTurno(turnoId)
        .then(item => {
          this.initTurneraTurnosList();
        }).catch(error => {
          //c onsole.log('ERROR AL CANCELAR EL TURNO!! %o', error);
        });
      }
    });
  }

  private openConfirmationDialog(): Observable<any> {
    const dialogRef = this._dialog.open(TurnosIndustrialesDialogConfirmationComponent);
    return dialogRef.afterClosed();
  }

  private openHasTurnoActivoDialog(): Observable<any> {
    const dialogRef = this._dialog.open(TurnosIndustrialesDialogConsultaComponent);
    return dialogRef.afterClosed();
  }
}

