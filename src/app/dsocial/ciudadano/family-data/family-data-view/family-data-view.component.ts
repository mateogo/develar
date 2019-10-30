import { Component, OnInit, Input } from '@angular/core';
import { Person, personModel, FamilyData } from '../../../../entities/person/person';

import { devutils }from '../../../../develar-commons/utils'

@Component({
  selector: 'family-view',
  templateUrl: './family-data-view.component.html',
  styleUrls: ['./family-data-view.component.scss']
})

export class FamilyDataViewComponent implements OnInit {

	@Input() familymember: FamilyData;
	public pname;
	public pdoc;
  public edad = 0;
  public edadTxt = '';
  public ocupacion;
  public nacionalidad;
  public estado;
  public neducativo;
  public vinculoTxt;

  constructor() { }

  ngOnInit() {
  	this.pname = personModel.getPersonDisplayName(this.familymember);
  	this.pdoc = personModel.getPersonDocum(this.familymember);
    if(this.familymember.fenac){
      this.edad = devutils.edadActual(new Date(this.familymember.fenac));
    }else{
      this.edad = 0
    }
    this.edadTxt = this.edad ? '(' + this.edad + ')' : '';

    this.vinculoTxt = personModel.getVinculo(this.familymember.vinculo);
    this.ocupacion = personModel.getProfesion(this.familymember.tocupacion)
    
    this.estado = personModel.getEstadoVinculo(this.familymember.estado);

    this.neducativo = personModel.getNivelEducativo(this.familymember.nestudios);

  }

}
