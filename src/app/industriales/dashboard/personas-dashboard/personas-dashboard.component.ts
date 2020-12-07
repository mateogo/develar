import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { devutils } from '../../../develar-commons/utils';
import { Person } from '../../../entities/person/person';
import { UserWeb } from '../../../entities/user-web/user-web.model';
import { UserService } from '../../../entities/user/user.service';
import { PersonService } from '../../../salud/person.service';
import { EmpresasController } from '../../../empresas/empresas.controller';

@Component({
  selector: 'personas-dashboard',
  templateUrl: './personas-dashboard.component.html',
  styleUrls: ['./personas-dashboard.component.scss']
})
export class PersonasDashboardComponent implements OnInit {

  public title: string = 'Persona';
  public subtitle: string = 'Mis datos personales'
  public person: Person;
  public showPersonData: boolean = false;
  
  constructor(private _router: Router,
    private _usuarioService: UserService,
    private _personService: PersonService,
    private _empCtrl: EmpresasController) { }

  ngOnInit(): void {

    let user = new UserWeb();
    user._id = this._usuarioService.currentUser._id;
    this._personService.fetchPersonByUserAGN(user).pipe(take(1)).subscribe(persona => {

      if (persona[0]) {
        this.person = persona[0];
        this.showPersonData = true;
        this._empCtrl.personListener.next(this.person);
      }
    })


    // this._usuarioService.userEmitter.subscribe(usuario => {
    //   if (usuario) {
    //     this._personService.fetchPersonByUserAGN(usuario).pipe(take(1)).subscribe(persona => {
    //       if (persona[0]) {
    //         this.person = persona[0];
    //         this.showPersonData = true;
    //         this._empCtrl.personListener.next(this.person);
    //       }
    //     })

    //   }
    // })

  }

  goToPersonData(): void {
    this._router.navigate(['dashboard', 'personas', this.person['_id']]);
  }

  currentAge() {
    let edad = '';

    if (!this.person.fenac) return 0;

    let valueDate: Date = new Date(this.person.fenac);
    if (valueDate) {
      let value = valueDate.getDate() + '/' + (valueDate.getMonth() + 1) + '/' + valueDate.getFullYear();
      let validAge = devutils.validAge(value);
      if (validAge) {
        edad = devutils.edadActual(devutils.dateFromTx(value)) + '';
      }
      return edad;

    }
  }
}
