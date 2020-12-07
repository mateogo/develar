import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { TurnoHelper } from '../../../entities/turnos/turno.helper';
import { Turno } from '../../../entities/turnos/turno.model';
import { TurnosService } from '../../../entities/turnos/turnos.service';
import { UserWeb } from '../../../entities/user-web/user-web.model';
import { UserService } from '../../../entities/user/user.service';

@Component({
  selector: 'dashboard-turnos',
  templateUrl: './dashboard-turnos.component.html',
  styleUrls: ['./dashboard-turnos.component.scss']
})
export class DashboardTurnosComponent implements OnInit {

  public user$: BehaviorSubject<UserWeb>;
  private user: UserWeb;
  public turnosList$: Observable<Turno[]>;

  public turnoDashboardTitle = 'Turnos asistencia / trámites presenciales';
  public turnoDashboardSubtitle = 'Sólo se muestran los turnos vigentes';

  public turnosList: Turno[];

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _turnoService: TurnosService,
    private _userService : UserService
  ) { }

  ngOnInit(): void {
    this.initTurnoDashboard();
  }

  private initTurnoDashboard() {
    this._userService.userEmitter.subscribe( user => {
      if (user && user._id) {
        this.user = new UserWeb();
        Object.assign(this.user,user);
        this._turnoService.fetchTurnoFromUser(this.user, { estado: 'activo' }).subscribe(items => {
          if (items && items.length > 0) {
            this.turnosList = items.map(turno => {
              turno.sede = TurnoHelper.getOptionLabel('sede', turno.sede);

              return turno;
            });
          }
        });
      } else {
        // TODO: Que hacer si no hay usuario?
      }
    })
      
  }

  gotoTurneraBrowse(): void {
    this._router.navigate(['turnospresenciales'], { relativeTo: this._route });
  }

}
