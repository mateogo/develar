import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel } from '../../../../entities/person/person';
import { CensoIndustriasService } from '../../../censo-service';

import { devutils }from '../../../../develar-commons/utils'

@Component({
  selector: 'empresa-core-view',
  templateUrl: './empresa-core-view.component.html',
  styleUrls: ['./empresa-core-view.component.scss']
})
export class EmpresaCoreViewComponent implements OnInit {
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

  constructor() { }

  ngOnInit() {
    this.familyName = personModel.getPersonFamilyName(this.person);
  	this.pname = personModel.getPersonDisplayName(this.person);
  	this.pdoc = personModel.getPersonDocum(this.person);
    this.edad = devutils.edadActual(new Date(this.person.fenac));
    this.nacionalidad = personModel.getNacionalidad(this.person.nacionalidad)
    this.estado = personModel.getEstadoCivilLabel(this.person.ecivil);
    this.neducativo = personModel.getNivelEducativo(this.person.nestudios);
    this.sexo = this.person.sexo;
    this.ocupacion = CensoIndustriasService.getOptionLabel('profesiones', this.person.tprofesion)

    if(this.person.fenac){
      this.edad = devutils.edadActual(new Date(this.person.fenac));
    }else{
      this.edad = 0
    }
    this.edadTxt = this.edad ? '(' + this.edad + ')' : '';


  }

}
