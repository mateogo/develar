import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel } from '../../../../entities/person/person';
import { devutils } from '../../../../develar-commons/utils';

@Component({
  selector: 'personas-core-view',
  templateUrl: './personas-core-view.component.html',
  styleUrls: ['./personas-core-view.component.scss']
})
export class PersonasCoreViewComponent implements OnInit {

  @Input() person: Person;
  public pname;
  public familyName;
  public pdoc;
  public edad;
  public edadTxt;
  public ocupacion;
  public nacionalidad;
  public estado;
  public neducativo;
  public sexo;

  constructor() { 
  }

  ngOnInit() {
    this.familyName = personModel.getPersonFamilyName(this.person);
    this.pname = personModel.getPersonDisplayName(this.person);
    this.pdoc = personModel.getPersonDocum(this.person);
    this.edad = devutils.edadActual(new Date(this.person.fenac));
    this.nacionalidad = personModel.getNacionalidad(this.person.nacionalidad)
    this.estado = personModel.getEstadoCivilLabel(this.person.ecivil);
    this.neducativo = personModel.getNivelEducativo(this.person.nestudios);
    this.sexo = this.person.sexo;

    if (this.person.fenac) {
      this.edad = devutils.edadActual(new Date(this.person.fenac));
    } else {
      this.edad = 0
    }
    this.edadTxt = this.edad ? '(' + this.edad + ')' : '';


  }
}